import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    rebuild(): Promise<{
        message: string;
    }>;
    create(createCategoryDto: CreateCategoryDto): Promise<import("./entities/category.entity").Category>;
    findAll(): Promise<import("./entities/category.entity").Category[]>;
    findOne(id: string): Promise<import("./entities/category.entity").Category | null>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<import("./entities/category.entity").Category | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
