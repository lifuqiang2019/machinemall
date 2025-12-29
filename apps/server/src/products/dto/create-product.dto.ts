export class CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: number;
  images?: string[];
  mainImage?: string;
  isFeatured?: boolean;
  details?: any;
}
