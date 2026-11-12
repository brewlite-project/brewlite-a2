# Render Demo Seed One-shot Guard

`render-demo-v1` identifies the approved, immutable Render demo fixture set: four categories, five toppings, nine products, thirteen Product–Topping links, and five coupons. `seed_executions.seed_key` is written in the same Serializable transaction as that fixture set.

Do not reuse this key for changed fixture semantics. A new key is required only when a separately reviewed, non-overwriting seed version has a distinct approved fixture contract and migration/deployment plan. Changing `render-demo-v1` to bypass drift or rerun the same data is prohibited.

## Safe deployment and one controlled Apply

1. Deploy the image and migration `20261112153000_seed_executions_once_guard` through the normal approved Render deployment path. Do not configure Apply mode yet.
2. Verify migration completion using a read-only database query or approved migration-status evidence: table `seed_executions` exists, with primary key `seed_key` and `completed_at` timestamp.
3. Verify with a read-only query that `seed_executions` contains zero rows for `render-demo-v1`. If it contains a marker, do not delete it and do not apply; investigate the current catalog/coupon state with dry-run.
4. Deploy or select the approved seed artifact and run Cloud dry-run only. It must pass policy/identity checks and report exactly the reviewed plan: `categories=0`, `toppings=5`, `products=9`, `productToppings=13`, `coupons=5`. Any drift, identity mismatch, or different count is a stop condition.
5. Obtain explicit human approval. Configure the one-time manual Apply marker and confirmation only for the controlled execution. Do not expose an HTTP endpoint and do not leave Apply confirmation in a normal service configuration.
6. Run Apply once. If it reports `APPLY_COMMITTED_CLEANUP_FAILED`, or the process/log outcome is otherwise unknown, do not retry Apply. Run a new dry-run and inspect the marker plus fixture state first.
7. Verify read-only that Catalog/Coupon data matches the approved fixtures and that there is exactly one `seed_executions` row with `seed_key = 'render-demo-v1'`. A follow-up dry-run must plan zero inserts.
8. Restore the service to its ordinary non-Apply startup configuration and remove the manual Apply marker/confirmation. Confirm the normal HTTP service is healthy.

The marker is a one-shot guard, not a replacement for backup/PITR or a deployment audit trail. It fails closed when the marker exists but expected records are missing or drifted.

## Local PostgreSQL integration suite

`test/seed-render-demo-once-guard.integration.spec.ts` is opt-in and refuses every target except `127.0.0.1:15432/brewlite_seed_once_guard_test`. The database must be a newly created, isolated local PostgreSQL 18 database with all migrations through migration 10 already applied, exactly the four migration-created approved categories, and no toppings, products, coupons, or marker. It never accepts `brewlite_seed_recovery`, Render URLs, or arbitrary local database names.

The suite uses the real Prisma transaction adapter. It first refuses any Order, Payment, Coupon redemption, or dependent row; it then deletes only test-seed rows in explicit child-to-parent order while preserving the four baseline categories. Do not enable it against a shared database. Supply its test URL through the process environment only, never a committed `.env` file.
