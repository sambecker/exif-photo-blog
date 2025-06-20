import { getCountsForCategories, getDataForCategories } from "@/category/data";

export const getDataForCategoriesCachedAction = async () => {
  return getDataForCategories();
};

export const getCountsForCategoriesCachedAction = async () => {
  return getCountsForCategories();
};