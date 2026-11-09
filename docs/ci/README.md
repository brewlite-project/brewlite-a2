# Continuous Integration

## Scope

`.github/workflows/ci.yml` runs on pull requests and pushes targeting `dev` or
`main`. It has two independent quality gates:

- `API CI`: install, generate Prisma Client, lint, unit tests, and build for
  `apps/api`.
- `Web CI`: install, lint, unit tests, and build for `apps/web`.

Both jobs use GitHub-hosted Ubuntu runners, Node.js 24, npm lockfile caching,
and `npm ci`. Their workflow token is limited to `contents: read`; the workflow
does not use secrets, database services, production configuration, or write
permissions.

## Local commands

Run each command from the named application directory.

### API

```bash
npm ci
DATABASE_URL='postgresql://ci:ci@127.0.0.1:5432/ci?schema=public' npm run db:generate
npm run lint
npm run test:unit
npm run build
```

`db:generate` creates the ignored Prisma Client at `src/generated/prisma`.
Prisma requires a syntactically valid `DATABASE_URL` while reading its config,
but this command does not connect to PostgreSQL. The placeholder above is not a
credential and must not be replaced with a production URL in CI.

### Web

```bash
npm ci
npm run lint
npm run test:unit
npm run build
```

On PowerShell, set the API placeholder for the single command with:

```powershell
$env:DATABASE_URL = 'postgresql://ci:ci@127.0.0.1:5432/ci?schema=public'
npm run db:generate
Remove-Item Env:DATABASE_URL
```

## Test boundary

`apps/api` `test:unit` uses the default Vitest config, whose include pattern is
`**/*.spec.ts`. Integration and E2E configs select `*.integration-spec.ts` and
`*.e2e-spec.ts` separately, so they are not part of this quality gate.
`test:unit:cov` is available for coverage reporting but is not a CI gate until
it can run reliably in the supported environments.

`apps/web` `test:unit` runs only:

- `checkout-flow.test.ts`
- `payment-ui.test.ts`
- `order-history.test.ts`
- `order-confirmation.test.ts`
- `vnpay-ui-flow.test.ts`

`payment-confirmation-flow.test.ts` deliberately remains in `npm test`, but is
excluded from `test:unit`. It starts a real NestJS runtime, creates/migrates a
PostgreSQL test database, and is therefore integration/E2E scope. CI also does
not run API integration/E2E suites, migrations, seeds, database services,
VNPay Sandbox calls, or deployment.

## Branch protection

Branch protection/rulesets are configured in GitHub, not by this workflow, and
are **unverified until a repository administrator configures them**. For both
`dev` and `main`, require pull requests and require the two checks emitted by a
real run of this workflow. Select the exact displayed check names, expected to
be `API CI` and `Web CI` (or their workflow-prefixed form in the GitHub UI), and
restrict bypass permissions according to the repository policy.

Verify enforcement with a disposable PR: introduce a harmless lint or unit-test
failure, confirm the corresponding check fails and merge is disabled, then fix
it and preserve the resulting Actions run URL/check summary as PASS/FAIL
evidence. A green local run is not GitHub Actions evidence.

## Reading failures

Open the failed workflow run, then the failed job and step. The step order is
Install, Prisma generation (API only), Lint, Unit Test, Build. Fix the first
real failure in the relevant app; do not add `continue-on-error`, `|| true`, or
skip a gate to make a run green.
