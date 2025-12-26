import { TreeRepository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
export declare class CategoriesService {
    private categoriesRepository;
    constructor(categoriesRepository: TreeRepository<Category>);
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    onModuleInit(): Promise<void>;
    rebuildTree(): Promise<{
        message: string;
    }>;
    findAll(): Promise<Category[]>;
    findOne(id: number): Promise<Category | null>;
    update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
