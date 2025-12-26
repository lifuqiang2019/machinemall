import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<import("./entities/product.entity").Product>;
    findAll(query: any): Promise<import("./entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("./entities/product.entity").Product | null>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("./entities/product.entity").Product | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
