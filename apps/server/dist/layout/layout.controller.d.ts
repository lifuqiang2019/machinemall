import { LayoutService } from './layout.service';
import { CreateLayoutDto } from './dto/create-layout.dto';
import { UpdateLayoutDto } from './dto/update-layout.dto';
export declare class LayoutController {
    private readonly layoutService;
    constructor(layoutService: LayoutService);
    create(createLayoutDto: CreateLayoutDto): Promise<import("./entities/layout.entity").Layout>;
    findAll(): Promise<import("./entities/layout.entity").Layout[]>;
    findOne(id: string): Promise<import("./entities/layout.entity").Layout | null>;
    update(id: string, updateLayoutDto: UpdateLayoutDto): Promise<import("./entities/layout.entity").Layout | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
