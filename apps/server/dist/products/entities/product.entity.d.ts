import { Category } from '../../categories/entities/category.entity';
export declare class Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    isFeatured: boolean;
    mainImage: string;
    details: any;
    category: Category;
    createdAt: Date;
    updatedAt: Date;
}
