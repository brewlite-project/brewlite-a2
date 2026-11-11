import { describe, expect, it } from "vitest";
import { categories, products, toppings } from "./seed-catalog.fixtures.js";

describe("catalog seed fixtures", () => {
  it("contains the expected fixture counts and unique identifiers", () => {
    expect(categories).toHaveLength(4);
    expect(products).toHaveLength(9);
    expect(toppings).toHaveLength(5);
    expect(new Set(categories.map((category) => category.code)).size).toBe(
      categories.length,
    );
    expect(new Set(products.map((product) => product.id)).size).toBe(products.length);
    expect(new Set(toppings.map((topping) => topping.code)).size).toBe(toppings.length);
    expect(new Set(toppings.map((topping) => topping.id)).size).toBe(toppings.length);
  });

  it("keeps product category and topping references valid", () => {
    const categoryCodes = new Set(categories.map((category) => category.code));
    const toppingCodes = new Set(toppings.map((topping) => topping.code));

    for (const product of products) {
      expect(categoryCodes.has(product.categoryCode)).toBe(true);
      for (const toppingCode of product.toppingCodes) {
        expect(toppingCodes.has(toppingCode)).toBe(true);
      }
    }
  });

  it("keeps the approved category, product ID, and topping data", () => {
    expect(categories).toEqual([
      { code: "traditional", name: "Cà phê truyền thống" },
      { code: "espresso_coldbrew", name: "Espresso & Cold Brew" },
      { code: "tea_macchiato", name: "Trà & Macchiato" },
      { code: "bakery", name: "Bánh ngọt" },
    ]);
    expect(products.map((product) => product.id)).toEqual([
      "a3000000-0000-4000-8000-000000000001",
      "a3000000-0000-4000-8000-000000000002",
      "a3000000-0000-4000-8000-000000000003",
      "a3000000-0000-4000-8000-000000000004",
      "a3000000-0000-4000-8000-000000000005",
      "a3000000-0000-4000-8000-000000000006",
      "a3000000-0000-4000-8000-000000000007",
      "a3000000-0000-4000-8000-000000000008",
      "a3000000-0000-4000-8000-000000000009",
    ]);
    expect(products).toEqual([
      { id: "a3000000-0000-4000-8000-000000000001", name: "Bạc Xỉu Kem Béo Phin", categoryCode: "traditional", price: 42000, stock: 25, image: "bac-xiu-kem-beo-phin", sizePolicy: "STANDARD", isNew: false, isBestseller: true, toppingCodes: ["CHEESE_FOAM", "WHIPPED_CREAM", "EXTRA_SHOT"] },
      { id: "a3000000-0000-4000-8000-000000000002", name: "Cà Phê Đen Đá Cầu Đất", categoryCode: "traditional", price: 32000, stock: 30, image: "ca-phe-den-da-cau-dat", sizePolicy: "STANDARD", isNew: false, isBestseller: true, toppingCodes: ["EXTRA_SHOT"] },
      { id: "a3000000-0000-4000-8000-000000000003", name: "Cà Phê Muối Cố Đô", categoryCode: "traditional", price: 39000, stock: 20, image: "ca-phe-muoi-co-do", sizePolicy: "STANDARD", isNew: true, isBestseller: false, toppingCodes: ["CHEESE_FOAM", "EXTRA_SHOT"] },
      { id: "a3000000-0000-4000-8000-000000000004", name: "Cà phê Sữa Đá Sài Gòn", categoryCode: "traditional", price: 35000, stock: 28, image: "ca-phe-sua-da-sai-gon", sizePolicy: "STANDARD", isNew: false, isBestseller: true, toppingCodes: ["EXTRA_SHOT", "WHIPPED_CREAM"] },
      { id: "a3000000-0000-4000-8000-000000000005", name: "Cold Brew Cam Sả Thảo Mộc", categoryCode: "espresso_coldbrew", price: 49000, stock: 18, image: "cold-brew-cam-sa-thao-moc", sizePolicy: "STANDARD", isNew: true, isBestseller: false, toppingCodes: ["EXTRA_SHOT"] },
      { id: "a3000000-0000-4000-8000-000000000006", name: "Cold Brew Vải Hoa Hồng", categoryCode: "espresso_coldbrew", price: 52000, stock: 16, image: "cold-brew-vai-hoa-hong", sizePolicy: "STANDARD", isNew: true, isBestseller: false, toppingCodes: [] },
      { id: "a3000000-0000-4000-8000-000000000007", name: "Espresso Macchiato Caramel", categoryCode: "espresso_coldbrew", price: 45000, stock: 22, image: "espresso-macchiato-caramel", sizePolicy: "STANDARD", isNew: false, isBestseller: false, toppingCodes: ["WHIPPED_CREAM", "EXTRA_SHOT"] },
      { id: "a3000000-0000-4000-8000-000000000008", name: "Trà Đào Cam Sả Hoàng Gia", categoryCode: "tea_macchiato", price: 46000, stock: 24, image: "tra-dao-cam-sa-hoang-gia", sizePolicy: "STANDARD", isNew: false, isBestseller: true, toppingCodes: ["GRASS_JELLY", "PEARL"] },
      { id: "a3000000-0000-4000-8000-000000000009", name: "Croissant Bơ Pháp Nướng", categoryCode: "bakery", price: 38000, stock: 15, image: "croissant-bo-phap-nuong", sizePolicy: "ONE_SIZE", isNew: true, isBestseller: false, toppingCodes: [] },
    ]);
    expect(toppings).toEqual([
      { id: "b2000000-0000-4000-8000-000000000001", code: "PEARL", name: "Trân châu", price: 5000 },
      { id: "b2000000-0000-4000-8000-000000000002", code: "CHEESE_FOAM", name: "Kem cheese", price: 10000 },
      { id: "b2000000-0000-4000-8000-000000000003", code: "EXTRA_SHOT", name: "Thêm shot espresso", price: 12000 },
      { id: "b2000000-0000-4000-8000-000000000004", code: "GRASS_JELLY", name: "Sương sáo", price: 5000 },
      { id: "b2000000-0000-4000-8000-000000000005", code: "WHIPPED_CREAM", name: "Kem tươi", price: 8000 },
    ]);
  });
});
