// SCRUM-121 source provenance. No database access; outputs are outside input scope.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const snapshotFileName = 'SCRUM-121-source-snapshot.json';
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const canonical = (bytes) => Buffer.from(bytes.toString('utf8').replaceAll('\r\n', '\n'), 'utf8');
const git = (root, args) => execFileSync('git', args, { cwd: root, maxBuffer: 32 * 1024 * 1024 });
const textGit = (root, args) => git(root, args).toString('utf8').trim();
const topInput = /^(package(?:-lock)?\.json|nest-cli\.json|tsconfig[^/]*\.json|(?:vitest[^/]*|prisma7\.config)\.ts|\.oxlintrc\.json|\.prettierrc)$/;

// Enumerate actual files, including untracked source. Never traverse dependencies,
// generated clients/build output, .env, logs, credentials or user data directories.
export function inputPaths(root) {
  const paths = [];
  const walk = (relative) => {
    if (!existsSync(join(root, relative))) return;
    for (const item of readdirSync(join(root, relative), { withFileTypes: true })) {
      if (item.name.startsWith('.') || ['node_modules', 'generated', 'dist', 'dist-seed', 'coverage'].includes(item.name)) continue;
      const path = `${relative}/${item.name}`;
      assert.ok(!item.isSymbolicLink(), `Refuse source symlink: ${path}`);
      if (item.isDirectory()) walk(path);
      else if (/\.(?:ts|mts|cts|mjs|cjs|js|json|prisma|sql|toml|snap)$/.test(item.name)) paths.push(path);
    }
  };
  for (const path of ['apps/api/src', 'apps/api/test', 'apps/api/prisma']) walk(path);
  for (const item of readdirSync(join(root, 'apps/api'), { withFileTypes: true })) {
    if (item.isFile() && topInput.test(item.name)) paths.push(`apps/api/${item.name}`);
  }
  if (existsSync(join(root, '.gitattributes'))) paths.push('.gitattributes');
  return paths.sort();
}

export function fingerprint(root) {
  return inputPaths(root).map((path) => {
    assert.ok(lstatSync(join(root, path)).isFile(), `Expected source file: ${path}`);
    const bytes = readFileSync(join(root, path));
    return { path, sizeBytes: bytes.length, rawSha256: sha256(bytes), canonicalLfSha256: sha256(canonical(bytes)) };
  });
}

// Batch-read immutable Git objects without checkout/smudge filters.
function baseFiles(root, commit, paths) {
  assert.match(commit, /^[0-9a-f]{40}$/);
  const output = execFileSync('git', ['cat-file', '--batch'], {
    cwd: root, input: paths.map((p) => `${commit}:${p}\n`).join(''), maxBuffer: 64 * 1024 * 1024,
  });
  const files = new Map(); let offset = 0;
  for (const path of paths) {
    const end = output.indexOf(10, offset);
    const header = output.subarray(offset, end).toString('utf8'); offset = end + 1;
    if (header.endsWith(' missing')) continue;
    const match = header.match(/^([0-9a-f]{40}) blob (\d+)$/);
    assert.ok(match, `Invalid Git blob header: ${path}`);
    const size = Number(match[2]);
    files.set(path, { oid: match[1], bytes: output.subarray(offset, offset + size) });
    offset += size + 1;
  }
  return files;
}

export function createSourceSnapshot(root) {
  const baseCommit = textGit(root, ['rev-parse', 'HEAD']);
  const manifest = fingerprint(root);
  const base = baseFiles(root, baseCommit, manifest.map((f) => f.path));
  const files = manifest.map((entry) => {
    const bytes = readFileSync(join(root, entry.path));
    assert.equal(sha256(bytes), entry.rawSha256, `Source changed during capture: ${entry.path}`);
    const original = base.get(entry.path);
    if (original) {
      for (const [encoding, transformed] of [
        ['git-exact', original.bytes], ['git-lf', canonical(original.bytes)],
        ['git-crlf', Buffer.from(canonical(original.bytes).toString('utf8').replaceAll('\n', '\r\n'))],
      ]) {
        if (bytes.equals(transformed)) return { ...entry, encoding, gitBlob: original.oid };
      }
    }
    return { ...entry, encoding: 'inline-base64', contentBase64: bytes.toString('base64') };
  });
  assert.deepEqual(fingerprint(root), manifest, 'Source changed during capture');
  const status = textGit(root, ['status', '--porcelain=v1', '--untracked-files=all']);
  const eolSetting = spawnSync('git', ['config', '--show-origin', '--get-regexp', 'core\\.(autocrlf|eol|safecrlf)|core\\.attributesfile'], { cwd: root, encoding: 'utf8' });
  return {
    format: 'brewlite-scrum121-source-v1', capturedAt: new Date().toISOString(), baseCommit,
    branch: textGit(root, ['branch', '--show-current']), workingTreeDirty: Boolean(status), status,
    algorithms: { raw: 'SHA-256 over exact file bytes', canonicalLf: 'SHA-256 over UTF-8 text after CRLF -> LF only; no trim/reformat',
      reconstruction: 'baseCommit Git blob + explicit EOL transform, or exact inline base64 for changed/new/mixed-EOL source' },
    scope: 'API src excluding generated; test; prisma including all migrations; package/lock/build/test/Prisma configs; .gitattributes. No docs/evidence outputs, dependencies, generated output, .env or DB data.',
    git: { version: textGit(root, ['--version']), eolSettings: eolSetting.stdout.trim(),
      fileEol: textGit(root, ['ls-files', '--eol', '--', ...manifest.map((f) => f.path)]) },
    manifestSha256: sha256(Buffer.from(JSON.stringify(manifest))), files,
  };
}

export function reconstructSource(root, snapshot) {
  assert.equal(snapshot.format, 'brewlite-scrum121-source-v1');
  const base = baseFiles(root, snapshot.baseCommit, snapshot.files.filter((f) => f.encoding !== 'inline-base64').map((f) => f.path));
  return snapshot.files.map((file) => {
    assert.ok(file.path === '.gitattributes' || /^apps\/api\//.test(file.path));
    assert.ok(!file.path.split('/').some((p) => p === '..' || p === 'node_modules' || p === 'generated' || p.startsWith('.env')));
    let bytes;
    if (file.encoding === 'inline-base64') bytes = Buffer.from(file.contentBase64, 'base64');
    else {
      const original = base.get(file.path); assert.ok(original, `Missing base blob: ${file.path}`);
      assert.equal(original.oid, file.gitBlob);
      if (file.encoding === 'git-exact') bytes = original.bytes;
      else if (file.encoding === 'git-lf') bytes = canonical(original.bytes);
      else { assert.equal(file.encoding, 'git-crlf'); bytes = Buffer.from(canonical(original.bytes).toString('utf8').replaceAll('\n', '\r\n')); }
    }
    assert.equal(bytes.length, file.sizeBytes, `Snapshot size: ${file.path}`);
    assert.equal(sha256(bytes), file.rawSha256, `Snapshot raw hash: ${file.path}`);
    assert.equal(sha256(canonical(bytes)), file.canonicalLfSha256, `Snapshot canonical hash: ${file.path}`);
    return { file, bytes };
  });
}

export function materializeSource(root, snapshot, destination) {
  assert.ok(!existsSync(destination), 'Refuse to overwrite snapshot destination');
  for (const { file, bytes } of reconstructSource(root, snapshot)) {
    const target = resolve(destination, file.path);
    assert.ok(target.startsWith(resolve(destination) + sep));
    mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, bytes);
  }
  verifyManifest(destination, snapshot.files);
}

export function verifyManifest(root, expected, canonicalOnly = false) {
  const actual = fingerprint(root);
  assert.deepEqual(actual.map((f) => f.path), expected.map((f) => f.path), 'Input file set changed');
  let eolDifferences = 0;
  for (let i = 0; i < actual.length; i++) {
    assert.equal(actual[i].canonicalLfSha256, expected[i].canonicalLfSha256, `Content changed: ${actual[i].path}`);
    if (actual[i].rawSha256 !== expected[i].rawSha256) eolDifferences++;
    if (!canonicalOnly) assert.equal(actual[i].rawSha256, expected[i].rawSha256, `Raw bytes changed: ${actual[i].path}`);
  }
  return { files: actual.length, rawEolDifferences: eolDifferences, mode: canonicalOnly ? 'canonical-LF content (raw differences reported)' : 'exact raw bytes' };
}

export function verifyEvidence(root, evidencePath, canonicalOnly = false) {
  const evidence = JSON.parse(readFileSync(evidencePath, 'utf8'));
  assert.equal(evidence.result, 'PASS', 'Evidence must come from a successful run');
  assert.equal(evidence.provenance.sourceUnchanged, true);
  assert.equal(evidence.provenance.testedSnapshotUnchanged, true);
  const artifact = resolve(dirname(evidencePath), evidence.provenance.snapshotFile);
  const bytes = readFileSync(artifact);
  assert.equal(sha256(bytes), evidence.provenance.snapshotSha256, 'Source artifact hash mismatch');
  const snapshot = JSON.parse(bytes);
  reconstructSource(root, snapshot);
  assert.equal(snapshot.manifestSha256, sha256(Buffer.from(JSON.stringify(snapshot.files.map(({ path, sizeBytes, rawSha256, canonicalLfSha256 }) => ({ path, sizeBytes, rawSha256, canonicalLfSha256 }))))));
  assert.equal(snapshot.baseCommit, evidence.headAtRun);
  assert.deepEqual(evidence.provenance.inputsBefore, evidence.provenance.inputsAfter);
  assert.deepEqual(evidence.provenance.inputsBefore, snapshot.files.map(({ path, sizeBytes, rawSha256, canonicalLfSha256 }) => ({ path, sizeBytes, rawSha256, canonicalLfSha256 })));
  return verifyManifest(root, snapshot.files, canonicalOnly);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
    if (process.argv.includes('--self-test')) {
      const snapshot = createSourceSnapshot(root);
      const destination = join(mkdtempSync(join(tmpdir(), 'scrum121-provenance-proof-')), 'source');
      materializeSource(root, snapshot, destination);
      verifyManifest(destination, snapshot.files);
      const schema = join(destination, 'apps/api/prisma/schema.prisma');
      const original = readFileSync(schema);
      writeFileSync(schema, Buffer.concat([original, Buffer.from('\n// intentional drift probe\n')]));
      assert.throws(() => verifyManifest(destination, snapshot.files), /Content changed/);
      writeFileSync(schema, original);
      const eolVariant = original.includes(Buffer.from('\r\n')) ? canonical(original) : Buffer.from(original.toString().replaceAll('\n', '\r\n'));
      writeFileSync(schema, eolVariant);
      assert.throws(() => verifyManifest(destination, snapshot.files), /Raw bytes changed/);
      assert.ok(verifyManifest(destination, snapshot.files, true).rawEolDifferences > 0);
      writeFileSync(schema, original);
      writeFileSync(join(destination, 'apps/api/test/provenance-new-input-probe.mjs'), '// intentional extra input\n');
      assert.throws(() => verifyManifest(destination, snapshot.files), /Input file set changed/);
      console.log('PASS provenance self-test: exact reconstruction, content drift, EOL-only distinction, extra input detected; no DB connection');
      process.exit(0);
    }
    const index = process.argv.indexOf('--verify');
    assert.ok(index >= 0 && process.argv[index + 1], 'Use --verify <evidence.json> [--canonical-lf]');
    const result = verifyEvidence(root, resolve(process.argv[index + 1]), process.argv.includes('--canonical-lf'));
    console.log(`PASS provenance: ${result.files} files, ${result.mode}; raw EOL differences=${result.rawEolDifferences}`);
  } catch (error) {
    console.error(`FAIL provenance: ${error.message}`); process.exitCode = 1;
  }
}
