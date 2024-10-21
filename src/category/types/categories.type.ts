import { Category } from 'src/category/entities/category.entity';

export type Pagination = {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
};

export type CategoriesResponse = {
  data: Category[];
  pagination: Pagination;
};
