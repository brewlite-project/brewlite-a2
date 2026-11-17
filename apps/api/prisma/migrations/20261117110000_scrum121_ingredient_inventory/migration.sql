-- SCRUM-121 / INV-03. Additive structures only; no legacy backfill/cutover.
-- Generated with Prisma migrate diff (baseline schema -> new schema), reviewed.
BEGIN;

-- CreateEnum
CREATE TYPE "ingredient_base_unit" AS ENUM ('G', 'ML', 'MG', 'UNIT');

-- CreateTable
CREATE TABLE "ingredients" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "base_unit" "ingredient_base_unit" NOT NULL,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_ingredients" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "size" "drink_size" NOT NULL,
    "ingredient_id" UUID NOT NULL,
    "quantity_per_unit" INTEGER NOT NULL,

    CONSTRAINT "recipe_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topping_ingredients" (
    "id" UUID NOT NULL,
    "topping_id" UUID NOT NULL,
    "ingredient_id" UUID NOT NULL,
    "quantity_per_topping" INTEGER NOT NULL,

    CONSTRAINT "topping_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_ingredient_reservations" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "ingredient_id" UUID NOT NULL,
    "quantity_reserved" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "released_at" TIMESTAMPTZ(6),

    CONSTRAINT "order_ingredient_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_code_key" ON "ingredients"("code");

-- CreateIndex
CREATE INDEX "ix_recipe_ingredients_ingredient_id" ON "recipe_ingredients"("ingredient_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_recipe_ingredients_product_size_ingredient" ON "recipe_ingredients"("product_id", "size", "ingredient_id");

-- CreateIndex
CREATE INDEX "ix_topping_ingredients_ingredient_id" ON "topping_ingredients"("ingredient_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_topping_ingredients_topping_ingredient" ON "topping_ingredients"("topping_id", "ingredient_id");

-- CreateIndex
CREATE INDEX "ix_order_ingredient_reservations_ingredient_id" ON "order_ingredient_reservations"("ingredient_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_order_ingredient_reservations_order_ingredient" ON "order_ingredient_reservations"("order_id", "ingredient_id");

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topping_ingredients" ADD CONSTRAINT "topping_ingredients_topping_id_fkey" FOREIGN KEY ("topping_id") REFERENCES "toppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topping_ingredients" ADD CONSTRAINT "topping_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_ingredient_reservations" ADD CONSTRAINT "order_ingredient_reservations_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_ingredient_reservations" ADD CONSTRAINT "order_ingredient_reservations_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Prisma cannot represent these CHECKs. Keep them in future SQL migrations and
-- verify using the SCRUM-121 PostgreSQL rehearsal/catalog assertions.
ALTER TABLE "ingredients" ADD CONSTRAINT "ck_ingredients_stock_nonnegative"
    CHECK ("stock_quantity" >= 0);
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "ck_recipe_ingredients_quantity_positive"
    CHECK ("quantity_per_unit" > 0);
ALTER TABLE "topping_ingredients" ADD CONSTRAINT "ck_topping_ingredients_quantity_positive"
    CHECK ("quantity_per_topping" > 0);
ALTER TABLE "order_ingredient_reservations" ADD CONSTRAINT "ck_order_ingredient_reservations_quantity_positive"
    CHECK ("quantity_reserved" > 0);

COMMIT;
