import { Category } from '../../categories/entities/category.entity';
export declare class Layout {
    id: number;
    name: string;
    type: string;
    order: number;
    isActive: boolean;
    config: any;
    categories: Category[];
}
