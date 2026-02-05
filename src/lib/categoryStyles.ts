import type { Category } from "@/types";

export const categoryThemeClassMap: Record<Category["colorToken"], string> = {
  frozen: "category-frozen",
  meat: "category-meat",
  grocery: "category-grocery",
  dairy: "category-dairy",
};

export const getCategoryThemeClass = (token?: Category["colorToken"]) =>
  categoryThemeClassMap[token ?? "grocery"] ?? categoryThemeClassMap.grocery;
