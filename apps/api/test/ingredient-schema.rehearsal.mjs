// SCRUM-121: explicit opt-in rehearsal, never uses DATABASE_URL from .env.
// Run from apps/api: node test/ingredient-schema.rehearsal.mjs
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import pg from 'pg';

const api = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repo = resolve(api, '../..');
const baseline = '3a183d67c12658432100298eefd2b4ffe0bbfb7a';
const taskPort = 55421;
const url = (database) => `postgresql://scrum121@127.0.0.1:${taskPort}/${database}`;

// Keep tool/OS environment, but remove inherited targets/opt-ins before setting
// task-specific values. Case-insensitive filtering also covers Windows aliases.
function subprocessEnv(database, parent = process.env) {
  const env = { ...parent };
  const controlled = new Set([
    'DATABASE_URL', 'ORDERS_TEST_DATABASE_URL', 'AUTH_TEST_DATABASE_URL',
    'SHADOW_DATABASE_URL', 'SEED_RENDER_INTEGRATION_DATABASE_URL',
    'SEED_RENDER_PG_INTEGRATION', 'PAYMENT_CONCURRENCY_TESTS',
    'NODE_ENV', 'PRISMA_RENDER_INTERNAL_MODE', 'ORDER_EXPIRATION_ENABLED',
    'PAYMENT_RECONCILIATION_ENABLED',
  ]);
  for (const key of Object.keys(env)) if (controlled.has(key.toUpperCase())) delete env[key];
  return { ...env, DATABASE_URL: url(database), ORDERS_TEST_DATABASE_URL: url(database),
    AUTH_TEST_DATABASE_URL: url(database), SHADOW_DATABASE_URL: url('scrum121_shadow_unused'),
    SEED_RENDER_PG_INTEGRATION: '0', PAYMENT_CONCURRENCY_TESTS: '0',
    NODE_ENV: 'test', PRISMA_RENDER_INTERNAL_MODE: '',
    ORDER_EXPIRATION_ENABLED: 'false', PAYMENT_RECONCILIATION_ENABLED: 'false' };
}

// A real child process asserts the filtered env without importing DB libraries
// or connecting to the sentinel target. This never mutates terminal process.env.
function verifySubprocessEnv() {
  const parent = { ...process.env, SEED_RENDER_PG_INTEGRATION: '1',
    SEED_RENDER_INTEGRATION_DATABASE_URL: 'OUT_OF_SCOPE_SENTINEL_DO_NOT_CONNECT',
    seed_render_pg_integration: '1', seed_render_integration_database_url: 'OUT_OF_SCOPE_SENTINEL_DO_NOT_CONNECT',
    PAYMENT_CONCURRENCY_TESTS: '1', AUTH_TEST_DATABASE_URL: 'OUT_OF_SCOPE_SENTINEL_DO_NOT_CONNECT' };
  const before = { ...parent };
  const env = subprocessEnv('scrum121_env_probe', parent);
  assert.deepEqual(parent, before, 'Filtering must not mutate parent environment');
  for (const key of ['PATH', 'Path', 'SystemRoot', 'TEMP', 'TMP']) {
    if (key in parent) assert.ok(env[key] === parent[key], 'Preserve tool/OS environment');
  }
  const proof = `const assert = require('node:assert/strict');
    assert.ok(process.env.SEED_RENDER_PG_INTEGRATION === '0');
    assert.ok(process.env.PAYMENT_CONCURRENCY_TESTS === '0');
    assert.ok(!Object.keys(process.env).some(k => k.toUpperCase() === 'SEED_RENDER_INTEGRATION_DATABASE_URL'));
    for (const key of ['DATABASE_URL','ORDERS_TEST_DATABASE_URL','AUTH_TEST_DATABASE_URL','SHADOW_DATABASE_URL']) {
      const target = new URL(process.env[key]);
      assert.ok(target.hostname === '127.0.0.1' && target.port === '55421');
      assert.ok(target.pathname.startsWith('/scrum121_'));
    }
    console.log('PASS filtered child environment; no database connection');`;
  const result = spawnSync(process.execPath, ['-e', proof], { env, encoding: 'utf8' });
  assert.equal(result.status, 0, 'Child environment isolation proof failed');
  assert.ok(result.stdout.includes('PASS filtered child environment'));
  return { method: 'real Node child with injected parent opt-ins/sentinel; no DB imports/connections',
    seedOptInDisabled: true, seedTargetRemoved: true, paymentConcurrencyDisabled: true,
    taskTargetsOnly: true, parentUnchanged: true };
}

const envProof = verifySubprocessEnv();
if (process.argv.includes('--check-env-only')) {
  console.log('PASS subprocess environment isolation (no database connection)');
  process.exit(0);
}
const port = Number(process.env.SCRUM121_TEST_PORT);
assert.equal(port, taskPort, 'Set SCRUM121_TEST_PORT=55421 for the dedicated cluster.');
const root = mkdtempSync(join(tmpdir(), 'brewlite-scrum121-rehearsal-'));
const evidence = { baseline, startedAt: new Date().toISOString(), root, checks: [], commands: [] };
evidence.changeHashes = Object.fromEntries([
  'prisma/schema.prisma', 'prisma/migrations/20261117110000_scrum121_ingredient_inventory/migration.sql',
  'test/ingredient-schema.rehearsal.mjs',
].map((path) => [path, createHash('sha256').update(readFileSync(join(api, path))).digest('hex')]));
const check = (name, detail) => {
  evidence.checks.push({ name, detail, result: 'PASS', at: new Date().toISOString() });
  console.log(`PASS ${name}`);
};
check('subprocess environment isolation', envProof);
const connection = (database) => ({ host: '127.0.0.1', port, user: 'scrum121', database });
function command(label, executable, args, cwd, database) {
  const env = subprocessEnv(database);
  const result = spawnSync(executable, args, { cwd, env, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  // Redact URLs even though this isolated cluster uses no password.
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.replace(/postgres(?:ql)?:\/\/[^\s"']+/g, '[REDACTED_DATABASE_URL]');
  writeFileSync(join(root, `${label}.log`), output);
  evidence.commands.push({ label, executable: executable === process.execPath ? 'node' : executable,
    args, cwd, database, exitCode: result.status, at: new Date().toISOString() });
  assert.equal(result.status, 0, `${label} failed; see isolated evidence log (no connection string).`);
  check(label, 'exit 0');
}
const prisma = (cwd, database, label, ...args) => command(label, process.execPath,
  ['node_modules/prisma/build/index.js', ...args, '--config', 'prisma7.config.ts'], cwd, database);
const tables = ['ingredients', 'recipe_ingredients', 'topping_ingredients', 'order_ingredient_reservations'];
const legacy = ['categories', 'products', 'toppings', 'product_toppings', 'users', 'coupons',
  'orders', 'order_items', 'order_item_toppings', 'coupon_redemptions', 'payments', 'payment_gateway_events', 'seed_executions'];
const ids = Object.fromEntries(['product', 'oneSize', 'topping', 'coupon', 'ingredient', 'otherIngredient',
  ...['paid', 'cancelled', 'pending', 'failed'].flatMap((s) => [s, `${s}User`])].map((key) => [key, randomUUID()]));

async function fixtures(db) {
  const category = 'b1000000-0000-4000-8000-000000000001';
  for (const [id, policy] of [[ids.product, 'STANDARD'], [ids.oneSize, 'ONE_SIZE']]) {
    await db.query(`INSERT INTO products(id,category_id,name,base_price_vnd,image_url,stock,size_policy,description,rating)
      VALUES($1,$2,'SCRUM-121 fixture',25000,'https://example.invalid/test.png',47,$3,'preserve exact text',4.5)`, [id, category, policy]);
  }
  await db.query(`INSERT INTO toppings(id,code,name,price_vnd) VALUES($1,'SCRUM121_TOPPING','Fixture',5000)`, [ids.topping]);
  await db.query('INSERT INTO product_toppings VALUES($1,$2)', [ids.product, ids.topping]);
  await db.query(`INSERT INTO coupons(id,code,type,value,starts_at,expires_at,usage_limit,per_user_limit,active_usage_count)
    VALUES($1,'SCRUM121','FIXED',1000,now()-interval '1 day',now()+interval '1 day',20,2,2)`, [ids.coupon]);
  for (const [key, status, redemption, payment] of [
    ['paid', 'PAID', 'CONSUMED', 'SUCCESS'], ['cancelled', 'CANCELLED', 'RELEASED', 'FAILED'],
    ['pending', 'PENDING', 'HELD', null], ['failed', 'PAYMENT_FAILED', 'HELD', 'FAILED'],
  ]) {
    await db.query(`INSERT INTO users(id,email,password_hash,full_name,loyalty_points)
      VALUES($1,$2,'test-fixture-not-a-login-hash','Fixture only',125)`, [ids[`${key}User`], `${key}@scrum121.invalid`]);
    await db.query(`INSERT INTO orders(id,user_id,coupon_id,coupon_code_snapshot,status,subtotal_vnd,discount_vnd,total_vnd,
      points_earned,expires_at,paid_at,cancelled_at) VALUES($1,$2,$3,'SCRUM121',$4::order_status,30000,1000,29000,$5,
      now()+interval '15 minutes', CASE WHEN $4::order_status='PAID' THEN now() END, CASE WHEN $4::order_status='CANCELLED' THEN now() END)`,
    [ids[key], ids[`${key}User`], ids.coupon, status, status === 'PAID' ? 29 : 0]);
    const item = randomUUID();
    await db.query(`INSERT INTO order_items(id,order_id,product_id,product_name_snapshot,size,size_percent_snapshot,
      base_price_snapshot_vnd,unit_price_vnd,quantity,line_total_vnd) VALUES($1,$2,$3,'Name snapshot','S',100,25000,30000,1,30000)`,
    [item, ids[key], ids.product]);
    await db.query(`INSERT INTO order_item_toppings(id,order_item_id,topping_id,topping_code_snapshot,topping_name_snapshot,topping_price_snapshot_vnd)
      VALUES($1,$2,$3,'SCRUM121_TOPPING','Topping snapshot',5000)`, [randomUUID(), item, ids.topping]);
    await db.query(`INSERT INTO coupon_redemptions(id,coupon_id,order_id,user_id,status,consumed_at,released_at)
      VALUES($1,$2,$3,$4,$5::redemption_status,CASE WHEN $5::redemption_status='CONSUMED' THEN now() END,CASE WHEN $5::redemption_status='RELEASED' THEN now() END)`,
    [randomUUID(), ids.coupon, ids[key], ids[`${key}User`], redemption]);
    if (payment) await db.query(`INSERT INTO payments(id,order_id,user_id,idempotency_key,request_hash,amount_vnd,provider,method,status,response_snapshot)
      VALUES($1,$2,$3,$4,'fixture-request-hash',29000,'MOCK','CARD',$5,'{"fixture":"preserve"}')`,
    [randomUUID(), ids[key], ids[`${key}User`], randomUUID(), payment]);
  }
}
async function snapshot(db) {
  const data = {};
  for (const table of legacy) {
    const { rows } = await db.query(`SELECT COALESCE(jsonb_agg(j ORDER BY j::text),'[]'::jsonb) AS data
      FROM (SELECT to_jsonb(t) AS j FROM "${table}" t) s`);
    data[table] = rows[0].data;
  }
  return data;
}
async function catalog(db) {
  const columns = (await db.query(`SELECT table_name,column_name,data_type,udt_name,is_nullable,column_default
    FROM information_schema.columns WHERE table_schema='public' AND table_name=ANY($1)
    ORDER BY table_name,ordinal_position`, [tables])).rows;
  const constraints = (await db.query(`SELECT c.relname AS table_name,con.conname,con.contype,con.convalidated,
    pg_get_constraintdef(con.oid) AS definition FROM pg_constraint con JOIN pg_class c ON c.oid=con.conrelid
    JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname=ANY($1)
    ORDER BY c.relname,con.conname`, [tables])).rows;
  const indexes = (await db.query(`SELECT tablename,indexname,indexdef FROM pg_indexes
    WHERE schemaname='public' AND tablename=ANY($1) ORDER BY tablename,indexname`, [tables])).rows;
  assert.equal(columns.length, 23);
  assert.equal(constraints.filter((c) => c.contype === 'p').length, 4);
  assert.equal(constraints.filter((c) => c.contype === 'f').length, 6);
  assert.equal(constraints.filter((c) => c.contype === 'c').length, 4);
  assert.ok(constraints.every((c) => c.convalidated));
  assert.ok(constraints.filter((c) => c.contype === 'f').every((c) => /ON DELETE RESTRICT/.test(c.definition) && /ON UPDATE CASCADE/.test(c.definition)));
  assert.equal(indexes.length, 11); // 4 PK + 4 unique + 3 reverse ingredient lookups.
  assert.equal(indexes.filter((i) => /CREATE UNIQUE INDEX/.test(i.indexdef)).length, 8);
  assert.equal(columns.filter((c) => c.is_nullable === 'YES').map((c) => c.column_name).join(), 'released_at');
  for (const column of columns.filter((c) => /quantity/.test(c.column_name))) assert.equal(column.data_type, 'integer');
  return { columns, constraints, indexes };
}
async function assertions(db, label) {
  let negative = 0;
  const negativeCases = [];
  const reject = async (name, sql, values, code, constraint, column) => {
    await db.query('SAVEPOINT invalid_case');
    let error;
    try { await db.query(sql, values); } catch (caught) { error = caught; }
    await db.query('ROLLBACK TO SAVEPOINT invalid_case');
    await db.query('RELEASE SAVEPOINT invalid_case');
    // pg returns the PostgreSQL DatabaseError directly: compare structured
    // SQLSTATE/constraint/column, never a message or an arbitrary exception.
    assert.equal(error?.code, code, `${name}: expected PostgreSQL ${code}`);
    if (constraint) assert.equal(error.constraint, constraint, `${name}: wrong constraint`);
    if (column) assert.equal(error.column, column, `${name}: wrong column`);
    negativeCases.push({ name, sqlstate: error.code,
      constraint: error.constraint ?? null, column: error.column ?? null });
    negative++;
  };
  await db.query('BEGIN');
  try {
    await db.query(`INSERT INTO ingredients(id,code,name,base_unit,stock_quantity) VALUES($1,'TEST_G','Fixture','G',0),($2,'TEST_MG','Fixture','MG',2147483647)`, [ids.ingredient, ids.otherIngredient]);
    for (const unit of ['ML', 'UNIT']) await db.query(`INSERT INTO ingredients(id,code,name,base_unit) VALUES($1,$2::text,'Fixture',$2::text::ingredient_base_unit)`, [randomUUID(), unit]);
    const ing = (code, quantity, unit = 'G') => [randomUUID(), code, unit, quantity];
    const insertIng = `INSERT INTO ingredients(id,code,name,base_unit,stock_quantity) VALUES($1,$2,'Fixture',$3,$4)`;
    await reject('duplicate code', insertIng, ing('TEST_G', 1), '23505', 'ingredients_code_key');
    await reject('negative stock', insertIng, ing('NEGATIVE', -1), '23514', 'ck_ingredients_stock_nonnegative');
    await reject('Int overflow', insertIng, ing('OVERFLOW', '2147483648'), '22003');
    await reject('fractional stock', insertIng, ing('FRACTION', '1.5'), '22P02');
    await reject('invalid unit', insertIng, ing('BAD_UNIT', 1, 'KG'), '22P02');
    const recipe = `INSERT INTO recipe_ingredients(id,product_id,size,ingredient_id,quantity_per_unit) VALUES($1,$2,$3,$4,$5)`;
    for (const size of ['S', 'M', 'L']) await db.query(recipe, [randomUUID(), ids.product, size, ids.ingredient, 1]);
    await db.query(recipe, [randomUUID(), ids.oneSize, 'ONE_SIZE', ids.ingredient, 2147483647]);
    await db.query(recipe, [randomUUID(), ids.product, 'S', ids.otherIngredient, 2]);
    await reject('duplicate product/size/ingredient', recipe, [randomUUID(), ids.product, 'S', ids.ingredient, 1], '23505', 'uq_recipe_ingredients_product_size_ingredient');
    await reject('null size', recipe, [randomUUID(), ids.product, null, ids.ingredient, 1], '23502', undefined, 'size');
    await reject('invalid size', recipe, [randomUUID(), ids.product, 'XL', ids.ingredient, 1], '22P02');
    const topping = `INSERT INTO topping_ingredients(id,topping_id,ingredient_id,quantity_per_topping) VALUES($1,$2,$3,$4)`;
    await db.query(topping, [randomUUID(), ids.topping, ids.ingredient, 1]);
    await db.query(topping, [randomUUID(), ids.topping, ids.otherIngredient, 2]);
    await reject('duplicate topping/ingredient', topping, [randomUUID(), ids.topping, ids.ingredient, 1], '23505', 'uq_topping_ingredients_topping_ingredient');
    const reservation = `INSERT INTO order_ingredient_reservations(id,order_id,ingredient_id,quantity_reserved) VALUES($1,$2,$3,$4)`;
    for (const key of ['pending', 'failed', 'paid', 'cancelled']) await db.query(reservation, [randomUUID(), ids[key], ids.ingredient, 7]);
    await db.query(reservation, [randomUUID(), ids.pending, ids.otherIngredient, 9]);
    await reject('duplicate order/ingredient', reservation, [randomUUID(), ids.pending, ids.ingredient, 1], '23505', 'uq_order_ingredient_reservations_order_ingredient');
    for (const q of [0, -1]) {
      await reject('nonpositive recipe', recipe, [randomUUID(), ids.oneSize, 'S', ids.otherIngredient, q], '23514', 'ck_recipe_ingredients_quantity_positive');
      await reject('nonpositive topping', topping, [randomUUID(), ids.topping, ids.ingredient, q], '23514', 'ck_topping_ingredients_quantity_positive');
      await reject('nonpositive reservation', reservation, [randomUUID(), ids.paid, ids.otherIngredient, q], '23514', 'ck_order_ingredient_reservations_quantity_positive');
    }
    for (const [name, sql, values, constraint] of [
      ['recipe product FK', recipe, [randomUUID(), randomUUID(), 'S', ids.ingredient, 1], 'recipe_ingredients_product_id_fkey'],
      ['recipe ingredient FK', recipe, [randomUUID(), ids.product, 'S', randomUUID(), 1], 'recipe_ingredients_ingredient_id_fkey'],
      ['topping FK', topping, [randomUUID(), randomUUID(), ids.ingredient, 1], 'topping_ingredients_topping_id_fkey'],
      ['topping ingredient FK', topping, [randomUUID(), ids.topping, randomUUID(), 1], 'topping_ingredients_ingredient_id_fkey'],
      ['order FK', reservation, [randomUUID(), randomUUID(), ids.ingredient, 1], 'order_ingredient_reservations_order_id_fkey'],
      ['reservation ingredient FK', reservation, [randomUUID(), ids.pending, randomUUID(), 1], 'order_ingredient_reservations_ingredient_id_fkey'],
    ]) await reject(name, sql, values, '23503', constraint);
    // Exercise each required column's actual NOT NULL (nullable release tested below).
    for (const [table, row] of [
      ['ingredients', { id: randomUUID(), code: 'NULLTEST', name: 'Fixture', base_unit: 'G', stock_quantity: 1, is_active: true, created_at: new Date(), updated_at: new Date() }],
      ['recipe_ingredients', { id: randomUUID(), product_id: ids.product, size: 'L', ingredient_id: ids.otherIngredient, quantity_per_unit: 1 }],
      ['topping_ingredients', { id: randomUUID(), topping_id: ids.topping, ingredient_id: ids.otherIngredient, quantity_per_topping: 1 }],
      ['order_ingredient_reservations', { id: randomUUID(), order_id: ids.paid, ingredient_id: ids.otherIngredient, quantity_reserved: 1, created_at: new Date() }],
    ]) {
      const names = Object.keys(row);
      for (const column of names) {
        const values = names.map((name) => name === column ? null : row[name]);
        await reject(`${table}.${column} required`, `INSERT INTO ${table}(${names.join(',')}) VALUES(${names.map((_, i) => `$${i + 1}`).join(',')})`, values, '23502', undefined, column);
      }
    }
    const before = (await db.query('SELECT quantity_reserved,released_at FROM order_ingredient_reservations WHERE order_id=$1 AND ingredient_id=$2', [ids.pending, ids.ingredient])).rows;
    assert.deepEqual(before, [{ quantity_reserved: 7, released_at: null }]);
    // Isolated parent fixtures: only the target new table references each one.
    // All are rolled back with this assertion transaction, not baseline fixtures.
    const toppingOnly = randomUUID();
    const orderOnly = randomUUID();
    const userOnly = randomUUID();
    const recipeIngredientOnly = randomUUID();
    const toppingIngredientOnly = randomUUID();
    await db.query(`INSERT INTO toppings(id,code,name,price_vnd) VALUES($1,'RESTRICT_ONLY','Fixture',0)`, [toppingOnly]);
    await db.query(topping, [randomUUID(), toppingOnly, ids.ingredient, 1]);
    await db.query(`INSERT INTO users(id,email,password_hash) VALUES($1,'restrict-only@scrum121.invalid','test-fixture-not-a-login-hash')`, [userOnly]);
    await db.query(`INSERT INTO orders(id,user_id,subtotal_vnd,total_vnd,expires_at) VALUES($1,$2,0,0,now()+interval '15 minutes')`, [orderOnly, userOnly]);
    await db.query(reservation, [randomUUID(), orderOnly, ids.otherIngredient, 1]);
    for (const [id, code] of [[recipeIngredientOnly, 'RECIPE_ONLY'], [toppingIngredientOnly, 'TOPPING_ONLY']]) {
      await db.query(insertIng, [id, code, 'G', 0]);
    }
    await db.query(recipe, [randomUUID(), ids.oneSize, 'ONE_SIZE', recipeIngredientOnly, 1]);
    await db.query(topping, [randomUUID(), toppingOnly, toppingIngredientOnly, 1]);
    await reject('recipe product restrict', 'DELETE FROM products WHERE id=$1', [ids.oneSize], '23001', 'recipe_ingredients_product_id_fkey');
    await reject('recipe ingredient restrict', 'DELETE FROM ingredients WHERE id=$1', [recipeIngredientOnly], '23001', 'recipe_ingredients_ingredient_id_fkey');
    await reject('topping restrict', 'DELETE FROM toppings WHERE id=$1', [toppingOnly], '23001', 'topping_ingredients_topping_id_fkey');
    await reject('topping ingredient restrict', 'DELETE FROM ingredients WHERE id=$1', [toppingIngredientOnly], '23001', 'topping_ingredients_ingredient_id_fkey');
    await db.query('UPDATE recipe_ingredients SET quantity_per_unit=22 WHERE ingredient_id=$1', [ids.ingredient]);
    await db.query('DELETE FROM recipe_ingredients WHERE ingredient_id=$1', [ids.ingredient]);
    await db.query('DELETE FROM topping_ingredients WHERE ingredient_id=$1', [ids.ingredient]);
    // Reservation FK alone protects snapshot ingredient (not just a recipe FK).
    await reject('snapshot ingredient restrict', 'DELETE FROM ingredients WHERE id=$1', [ids.ingredient], '23001', 'order_ingredient_reservations_ingredient_id_fkey');
    await reject('history order restrict', 'DELETE FROM orders WHERE id=$1', [orderOnly], '23001', 'order_ingredient_reservations_order_id_fkey');
    assert.deepEqual((await db.query('SELECT quantity_reserved,released_at FROM order_ingredient_reservations WHERE order_id=$1 AND ingredient_id=$2', [ids.pending, ids.ingredient])).rows, before);
    const changedId = randomUUID();
    await db.query('UPDATE ingredients SET id=$1 WHERE id=$2', [changedId, ids.ingredient]);
    assert.equal((await db.query('SELECT count(*)::int AS n FROM order_ingredient_reservations WHERE ingredient_id=$1', [changedId])).rows[0].n, 4);
    await db.query('UPDATE order_ingredient_reservations SET released_at=now() WHERE order_id=$1', [ids.cancelled]);
    assert.ok((await db.query('SELECT released_at FROM order_ingredient_reservations WHERE order_id=$1', [ids.cancelled])).rows[0].released_at);
    // No claim of transaction-level immutability/once-only release or size-policy validation.
    check(label, { negativeAssertions: negative, negativeCases,
      valid: 'all base units, Int bounds, S/M/L/ONE_SIZE, multi-ingredient, Order states, snapshot independent of recipes, nullable release, FK update cascade' });
  } finally { await db.query('ROLLBACK'); }
}

let admin;
const clients = [];
try {
  admin = new pg.Client(connection('postgres'));
  await admin.connect();
  const server = (await admin.query(`SELECT version(),current_setting('cluster_name') AS cluster,current_user`)).rows[0];
  assert.equal(server.cluster, 'brewlite_scrum121_test');
  assert.equal(server.current_user, 'scrum121');
  assert.match(server.version, /PostgreSQL 18\./);
  evidence.server = server;
  const suffix = randomUUID().replaceAll('-', '').slice(0, 12);
  const clean = `scrum121_clean_${suffix}`;
  const upgrade = `scrum121_upgrade_${suffix}`;
  evidence.databases = { clean, upgrade };
  for (const database of [clean, upgrade]) assert.match(database, /^scrum121_(clean|upgrade)_[0-9a-f]{12}$/);
  assert.equal((await admin.query('SELECT datname FROM pg_database WHERE datname=ANY($1)', [[clean, upgrade]])).rowCount, 0,
    'Refuse to reuse existing databases');
  for (const database of [clean, upgrade]) await admin.query(`CREATE DATABASE "${database}"`);
  check('isolated PostgreSQL 18', { port, cluster: server.cluster, databases: evidence.databases });
  const archive = join(root, 'baseline.tar');
  const tar = execFileSync('git', ['archive', '--format=tar', baseline, 'apps/api'], {
    cwd: repo, env: subprocessEnv(upgrade), maxBuffer: 100 * 1024 * 1024 });
  writeFileSync(archive, tar);
  const tarExecutable = process.platform === 'win32' ? join(process.env.SystemRoot ?? 'C:/Windows', 'System32/tar.exe') : 'tar';
  execFileSync(tarExecutable, ['-xf', archive, '-C', root], { env: subprocessEnv(upgrade) });
  const oldApi = join(root, 'apps/api');
  symlinkSync(join(api, 'node_modules'), join(oldApi, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  evidence.versions = { node: process.version,
    prisma: JSON.parse(readFileSync(join(api, 'node_modules/prisma/package.json'))).version,
    client: JSON.parse(readFileSync(join(api, 'node_modules/@prisma/client/package.json'))).version };
  prisma(api, clean, 'clean-deploy', 'migrate', 'deploy');
  prisma(api, clean, 'clean-status', 'migrate', 'status');
  prisma(api, clean, 'clean-redeploy', 'migrate', 'deploy');
  prisma(oldApi, upgrade, 'baseline-deploy', 'migrate', 'deploy');
  const cleanDb = new pg.Client(connection(clean)); await cleanDb.connect(); clients.push(cleanDb);
  const upgradeDb = new pg.Client(connection(upgrade)); await upgradeDb.connect(); clients.push(upgradeDb);
  await fixtures(upgradeDb);
  const before = await snapshot(upgradeDb);
  writeFileSync(join(root, 'legacy-before.json'), JSON.stringify(before, null, 2));
  evidence.beforeHash = createHash('sha256').update(JSON.stringify(before)).digest('hex');
  prisma(api, upgrade, 'upgrade-deploy', 'migrate', 'deploy');
  prisma(api, upgrade, 'upgrade-status', 'migrate', 'status');
  prisma(api, upgrade, 'upgrade-redeploy', 'migrate', 'deploy');
  const after = await snapshot(upgradeDb);
  writeFileSync(join(root, 'legacy-after.json'), JSON.stringify(after, null, 2));
  assert.deepEqual(after, before);
  evidence.afterHash = createHash('sha256').update(JSON.stringify(after)).digest('hex');
  check('legacy whole-row preservation', { hash: evidence.afterHash, counts: Object.fromEntries(Object.entries(after).map(([key, rows]) => [key, rows.length])) });
  for (const [name, db] of [['clean', cleanDb], ['upgrade', upgradeDb]]) {
    if (name === 'clean') await fixtures(db);
    const schema = await catalog(db);
    writeFileSync(join(root, `${name}-catalog.json`), JSON.stringify(schema, null, 2));
    check(`${name} catalog`, { columns: schema.columns.length, constraints: schema.constraints.length, indexes: schema.indexes.length });
    assert.equal((await db.query('SELECT count(*)::int AS n FROM order_ingredient_reservations')).rows[0].n, 0);
    await assertions(db, `${name} constraints`);
  }
  prisma(api, upgrade, 'prisma-validate', 'validate');
  prisma(api, upgrade, 'new-client-generate', 'generate');
  command('backend-build', process.execPath, ['node_modules/@nestjs/cli/bin/nest.js', 'build'], api, upgrade);
  // Exercise generated relations/defaults as well as the raw PostgreSQL checks.
  const smoke = join(oldApi, 'ingredient-client-smoke.mjs');
  writeFileSync(smoke, `import assert from 'node:assert/strict';
import { PrismaClient } from ${JSON.stringify(pathToFileURL(join(api, 'dist/generated/prisma/client.js')).href)};
import { PrismaPg } from '@prisma/adapter-pg';
const prisma = new PrismaClient({adapter:new PrismaPg({connectionString:process.env.DATABASE_URL})});
try { await prisma.$transaction(async tx => {
  const ingredient = await tx.ingredient.create({data:{code:'ORM_SMOKE',name:'Fixture',baseUnit:'MG'}});
  assert.equal(ingredient.stockQuantity,0); assert.equal(ingredient.isActive,true);
  assert.ok(ingredient.createdAt instanceof Date); assert.ok(ingredient.updatedAt instanceof Date);
  const recipe = await tx.recipeIngredient.create({data:{productId:${JSON.stringify(ids.oneSize)},size:'ONE_SIZE',ingredientId:ingredient.id,quantityPerUnit:1000}});
  const topping = await tx.toppingIngredient.create({data:{toppingId:${JSON.stringify(ids.topping)},ingredientId:ingredient.id,quantityPerTopping:500}});
  const reservation = await tx.orderIngredientReservation.create({data:{orderId:${JSON.stringify(ids.paid)},ingredientId:ingredient.id,quantityReserved:1500}});
  assert.equal(reservation.releasedAt,null);
  const stored = await tx.ingredient.findUniqueOrThrow({where:{id:ingredient.id},include:{recipeIngredients:true,toppingIngredients:true,orderReservations:true}});
  assert.equal(stored.recipeIngredients[0].size,'ONE_SIZE');
  assert.equal(stored.toppingIngredients.length,1); assert.equal(stored.orderReservations[0].quantityReserved,1500);
  await tx.recipeIngredient.update({where:{id:recipe.id},data:{quantityPerUnit:2000}});
  assert.equal((await tx.orderIngredientReservation.findUniqueOrThrow({where:{id:reservation.id}})).quantityReserved,1500);
  await tx.orderIngredientReservation.delete({where:{id:reservation.id}});
  await tx.toppingIngredient.delete({where:{id:topping.id}});
  await tx.recipeIngredient.delete({where:{id:recipe.id}});
  await tx.ingredient.delete({where:{id:ingredient.id}});
}); } finally { await prisma.$disconnect(); }
console.log('PASS Prisma model/relations/defaults/snapshot roundtrip');`);
  command('new-client-roundtrip', process.execPath, [smoke], oldApi, upgrade);
  command('unit-tests', process.execPath, ['node_modules/vitest/vitest.mjs', 'run'], api, upgrade);
  // Generate the actual old schema/client in the source snapshot, then execute
  // unmodified baseline HTTP/DB integration tests against the UPGRADED database.
  prisma(oldApi, upgrade, 'baseline-client-generate', 'generate');
  command('baseline-runtime', process.execPath, ['node_modules/vitest/vitest.mjs', 'run', '--config', './vitest.config.integration.ts',
    'test/inventory-postgres.integration-spec.ts', 'test/payments-postgres.integration-spec.ts',
    'test/promotions-postgres.integration-spec.ts', 'test/order-lifecycle.integration-spec.ts'], oldApi, upgrade);
  evidence.result = 'PASS';
} catch (error) {
  evidence.result = 'FAIL';
  // Error text can contain only our assertion/command labels; don't dump pg errors/URLs.
  evidence.failure = error instanceof assert.AssertionError ? error.message : error?.code ?? error?.name ?? 'Unknown error';
  console.error(`FAIL ${evidence.failure}`);
  process.exitCode = 1;
} finally {
  await Promise.all(clients.map((client) => client.end()));
  if (admin) await admin.end();
  evidence.finishedAt = new Date().toISOString();
  writeFileSync(join(root, 'evidence.json'), JSON.stringify(evidence, null, 2));
  console.log(`Evidence: ${root}`);
}
