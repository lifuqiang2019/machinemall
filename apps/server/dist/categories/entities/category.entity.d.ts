import { Product } from '../../products/entities/product.entity';
export declare class Category {
    id: number;
    name: string;
    description: string;
    image: string;
    children: Category[];
    parent: Category | null;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
