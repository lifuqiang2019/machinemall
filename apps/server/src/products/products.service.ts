import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create(createProductDto);
    if (createProductDto.categoryId) {
        product.category = { id: createProductDto.categoryId } as any;
    }
    return this.productsRepository.save(product);
  }

  findAll(query: any = {}) {
    const where: any = {};
    if (query.categoryId) {
        where.category = { id: query.categoryId };
    }
    
    return this.productsRepository.find({ 
        where,
        relations: ['category'],
        take: query.limit ? +query.limit : undefined
    });
  }

  findOne(id: number) {
    return this.productsRepository.findOne({ where: { id }, relations: ['category'] });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) return null;

    Object.assign(product, updateProductDto);

    if (updateProductDto.categoryId) {
        product.category = { id: updateProductDto.categoryId } as any;
    }

    return this.productsRepository.save(product);
  }

  remove(id: number) {
    return this.productsRepository.delete(id);
  }
}
