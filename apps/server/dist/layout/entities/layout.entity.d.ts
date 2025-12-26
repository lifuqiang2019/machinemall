import { Category } from '../../categories/entities/category.entity';
export declare class Layout {
    id: number;
    name: string;
    type: string;
    order: number;
    isActive: boolean;
    categoryId: number;
    category: Category;
}
