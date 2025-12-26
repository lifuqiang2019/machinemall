import { Repository } from 'typeorm';
import { Layout } from './entities/layout.entity';
import { CreateLayoutDto } from './dto/create-layout.dto';
import { UpdateLayoutDto } from './dto/update-layout.dto';
export declare class LayoutService {
    private layoutRepository;
    constructor(layoutRepository: Repository<Layout>);
    create(createLayoutDto: CreateLayoutDto): Promise<Layout[]>;
    findAll(): Promise<Layout[]>;
    findOne(id: number): Promise<Layout | null>;
    update(id: number, updateLayoutDto: UpdateLayoutDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
