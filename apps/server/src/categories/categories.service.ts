import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: TreeRepository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category();
    category.name = createCategoryDto.name;
    category.description = createCategoryDto.description || '';
    category.image = createCategoryDto.image || '';
    
    if (createCategoryDto.parentId) {
      const parent = await this.categoriesRepository.findOneBy({ id: createCategoryDto.parentId });
      if (parent) {
        category.parent = parent;
      }
    }
    
    return this.categoriesRepository.save(category);
  }

  async onModuleInit() {
    // Rebuild closure table on startup to ensure consistency
    // This is useful during development if the table structure changed
    // await this.categoriesRepository.manager.getTreeRepository(Category).rebuildClosureTable();
  }

  async rebuildTree() {
      // @ts-ignore
      await this.categoriesRepository.rebuildClosureTable();
      return { message: 'Tree rebuilt successfully' };
  }

  async findAll() {
    // Explicitly load relations to debug
    // const trees = await this.categoriesRepository.findTrees();
    
    // Fallback to manual query to verify data exists
    // const all = await this.categoriesRepository.find({ relations: ['parent', 'children'] });
    // console.log('All Categories with relations:', JSON.stringify(all, null, 2));

    return this.categoriesRepository.findTrees();
  }

  findOne(id: number) {
    return this.categoriesRepository.findOne({ 
        where: { id },
        relations: ['parent', 'children']
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    console.log(`[Backend Service] Update payload for ${id}:`, updateCategoryDto);
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) return null;

    category.name = updateCategoryDto.name ?? category.name;
    category.description = updateCategoryDto.description ?? category.description;
    category.image = updateCategoryDto.image ?? category.image;

    if (updateCategoryDto.parentId) {
       const parent = await this.categoriesRepository.findOneBy({ id: updateCategoryDto.parentId });
       if (parent) {
           category.parent = parent;
       }
    } else if (updateCategoryDto.parentId === null) {
      category.parent = null;
    }

    console.log(`[Backend Service] Saving category:`, category);
    return this.categoriesRepository.save(category);
  }

  remove(id: number) {
    return this.categoriesRepository.delete(id);
  }
}
