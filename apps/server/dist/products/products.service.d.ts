import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
export declare class ProductsService {
    private productsRepository;
    constructor(productsRepository: Repository<Product>);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(query?: any): Promise<Product[]>;
    findOne(id: number): Promise<Product | null>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<Product | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
