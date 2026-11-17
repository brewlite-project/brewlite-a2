-- PR #38 / D-06: keep the already-applied inventory migration immutable.
-- Validates existing rows. Invalid historical timestamps must block deployment;
-- do not rewrite timestamps, skip validation, reset, or resolve around failures.
BEGIN;

ALTER TABLE "order_ingredient_reservations"
    ADD CONSTRAINT "ck_order_ingredient_reservations_release_time"
    CHECK ("released_at" IS NULL OR "released_at" >= "created_at");

COMMIT;
