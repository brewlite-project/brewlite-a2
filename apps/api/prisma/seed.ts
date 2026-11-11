/**
 * BrewLite API Contract v2.1 demo product seed.
 * Source names/image links: danh_s_ch_s_n_ph_m_ng_d_n_nh.md.
 * Price, stock, categories, badges, topping eligibility: suggested DEMO data.
 * Strict nine-product catalog: refuses to run if any other products exist.
 * Never deletes legacy products or touches orders.
 * Download images into apps/web/public/images before running the web app.
 */
import "dotenv/config";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { categories, products, toppings } from "./seed-catalog.fixtures.js";

export function isSeedDatabaseAllowed(
  databaseUrl: string,
  allowComposeDemoSeed = process.env.ALLOW_COMPOSE_DEMO_SEED,
): boolean {
  const url = new URL(databaseUrl);
  const databaseName = decodeURIComponent(url.pathname.slice(1));
  const isDedicatedSeedDatabase = /^brewlite_seed_[a-z0-9_]+$/i.test(databaseName);
  const isApprovedComposeDatabase =
    databaseName === "brewlite_a2" &&
    url.hostname === "postgres" &&
    url.port === "5432" &&
    allowComposeDemoSeed === "true";

  return isDedicatedSeedDatabase || isApprovedComposeDatabase;
}

function isMainModule(): boolean {
  const entrypoint = process.argv[1];
  return (
    typeof entrypoint === "string" &&
    import.meta.url === pathToFileURL(resolve(entrypoint)).href
  );
}

async function main(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
    const wantedIds = products.map((product) => product.id);
    const otherProducts = await tx.product.findMany({
      where: { id: { notIn: wantedIds } },
      select: { id: true, name: true },
      take: 5,
    });
    if (otherProducts.length > 0) {
      throw new Error(
        `Database already contains legacy/unlisted products (sample: ${otherProducts.map((p) => p.name).join(", ")}). ` +
        `Refusing to seed a catalog that must contain only 9 products. Use a clean brewlite_seed_* DB; do not delete products referenced by orders.`,
      );
    }
    const categoryIds = new Map<string, string>();
    for (const category of categories) {
      const row = await tx.category.upsert({
        where: { code: category.code },
        create: { ...category, isActive: true },
        update: { name: category.name }, // preserve manually deactivated categories
      });
      categoryIds.set(category.code, row.id);
    }
    const toppingIds = new Map<string, string>();
    for (const topping of toppings) {
      const row = await tx.topping.upsert({
        where: { code: topping.code },
        create: { id: topping.id, code: topping.code, name: topping.name, priceVnd: BigInt(topping.price), isAvailable: true },
        update: { name: topping.name, priceVnd: BigInt(topping.price) }, // preserve availability
      });
      toppingIds.set(topping.code, row.id);
    }
    for (const product of products) {
      const categoryId = categoryIds.get(product.categoryCode);
      if (!categoryId) throw new Error(`Missing category ${product.categoryCode}`);
      const data = {
        name: product.name,
        categoryId,
        description: null,
        basePriceVnd: BigInt(product.price),
        imageUrl: `/images/${product.image}.jpg`,
        sizePolicy: product.sizePolicy === "ONE_SIZE" ? ("ONE_SIZE" as const) : ("STANDARD" as const),
        isNew: product.isNew,
        isBestseller: product.isBestseller,
        rating: null,
      };
      await tx.product.upsert({
        where: { id: product.id },
        create: { id: product.id, ...data, stock: product.stock },
        update: data, // Preserve stock on reruns (do not reset inventory).
      });
      for (const code of product.toppingCodes) {
        const toppingId = toppingIds.get(code);
        if (!toppingId) throw new Error(`Missing topping ${code}`);
        await tx.productTopping.upsert({
          where: { productId_toppingId: { productId: product.id, toppingId } },
          create: { productId: product.id, toppingId },
          update: {},
        });
      }
    }
  });
  console.log(`Seed completed: ${products.length} menu products, ${toppings.length} toppings; no legacy products present.`);
}

if (isMainModule()) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured");

  const databaseName = decodeURIComponent(new URL(databaseUrl).pathname.slice(1));
  // Preserve dedicated brewlite_seed_* databases. Compose needs all four exact
  // conditions in isSeedDatabaseAllowed; never broaden this to a wildcard.
  if (!isSeedDatabaseAllowed(databaseUrl)) {
    throw new Error(`Seeding is not allowed for database: ${databaseName}`);
  }

  // Run on a dedicated clean test or explicitly approved Compose database only.
  // Legacy products may be referenced by orders; the strict check below never
  // silently deletes or deactivates them.
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  main(prisma)
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exitCode = 1;
    })
    .finally(async () => prisma.$disconnect());
}
