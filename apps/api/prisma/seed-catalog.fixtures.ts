export const categories = [
  { code: "traditional", name: "Cà phê truyền thống" },
  { code: "espresso_coldbrew", name: "Espresso & Cold Brew" },
  { code: "tea_macchiato", name: "Trà & Macchiato" },
  { code: "bakery", name: "Bánh ngọt" },
] as const;

// Prices and stocks are example values; confirm before release.
// Deliberately use NEW IDs to avoid rewriting products referenced by past orders.
export const products = [
  { id: "a3000000-0000-4000-8000-000000000001", name: "Bạc Xỉu Kem Béo Phin", categoryCode: "traditional", price: 42000, stock: 25, image: "bac-xiu-kem-beo-phin", sizePolicy: "STANDARD", isNew: false, isBestseller: true, toppingCodes: ["CHEESE_FOAM", "WHIPPED_CREAM", "EXTRA_SHOT"] },
  { id: "a3000000-0000-4000-8000-000000000002", name: "Cà Phê Đen Đá Cầu Đất", categoryCode: "traditional", price: 32000, stock: 30, image: "ca-phe-den-da-cau-dat", sizePolicy: "STANDARD", isNew: false, isBestseller: true, toppingCodes: ["EXTRA_SHOT"] },
  { id: "a3000000-0000-4000-8000-000000000003", name: "Cà Phê Muối Cố Đô", categoryCode: "traditional", price: 39000, stock: 20, image: "ca-phe-muoi-co-do", sizePolicy: "STANDARD", isNew: true, isBestseller: false, toppingCodes: ["CHEESE_FOAM", "EXTRA_SHOT"] },
  { id: "a3000000-0000-4000-8000-000000000004", name: "Cà phê Sữa Đá Sài Gòn", categoryCode: "traditional", price: 35000, stock: 28, image: "ca-phe-sua-da-sai-gon", sizePolicy: "STANDARD", isNew: false, isBestseller: true, toppingCodes: ["EXTRA_SHOT", "WHIPPED_CREAM"] },
  { id: "a3000000-0000-4000-8000-000000000005", name: "Cold Brew Cam Sả Thảo Mộc", categoryCode: "espresso_coldbrew", price: 49000, stock: 18, image: "cold-brew-cam-sa-thao-moc", sizePolicy: "STANDARD", isNew: true, isBestseller: false, toppingCodes: ["EXTRA_SHOT"] },
  { id: "a3000000-0000-4000-8000-000000000006", name: "Cold Brew Vải Hoa Hồng", categoryCode: "espresso_coldbrew", price: 52000, stock: 16, image: "cold-brew-vai-hoa-hong", sizePolicy: "STANDARD", isNew: true, isBestseller: false, toppingCodes: [] },
  { id: "a3000000-0000-4000-8000-000000000007", name: "Espresso Macchiato Caramel", categoryCode: "espresso_coldbrew", price: 45000, stock: 22, image: "espresso-macchiato-caramel", sizePolicy: "STANDARD", isNew: false, isBestseller: false, toppingCodes: ["WHIPPED_CREAM", "EXTRA_SHOT"] },
  { id: "a3000000-0000-4000-8000-000000000008", name: "Trà Đào Cam Sả Hoàng Gia", categoryCode: "tea_macchiato", price: 46000, stock: 24, image: "tra-dao-cam-sa-hoang-gia", sizePolicy: "STANDARD", isNew: false, isBestseller: true, toppingCodes: ["GRASS_JELLY", "PEARL"] },
  { id: "a3000000-0000-4000-8000-000000000009", name: "Croissant Bơ Pháp Nướng", categoryCode: "bakery", price: 38000, stock: 15, image: "croissant-bo-phap-nuong", sizePolicy: "ONE_SIZE", isNew: true, isBestseller: false, toppingCodes: [] },
] as const;

export const toppings = [
  { id: "b2000000-0000-4000-8000-000000000001", code: "PEARL", name: "Trân châu", price: 5000 },
  { id: "b2000000-0000-4000-8000-000000000002", code: "CHEESE_FOAM", name: "Kem cheese", price: 10000 },
  { id: "b2000000-0000-4000-8000-000000000003", code: "EXTRA_SHOT", name: "Thêm shot espresso", price: 12000 },
  { id: "b2000000-0000-4000-8000-000000000004", code: "GRASS_JELLY", name: "Sương sáo", price: 5000 },
  { id: "b2000000-0000-4000-8000-000000000005", code: "WHIPPED_CREAM", name: "Kem tươi", price: 8000 },
] as const;
