"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const layout_entity_1 = require("./entities/layout.entity");
let LayoutService = class LayoutService {
    layoutRepository;
    constructor(layoutRepository) {
        this.layoutRepository = layoutRepository;
    }
    async create(createLayoutDto) {
        const { categoryIds, ...rest } = createLayoutDto;
        const layout = this.layoutRepository.create(rest);
        if (categoryIds && categoryIds.length > 0) {
            layout.categories = categoryIds.map((id) => ({ id }));
        }
        return this.layoutRepository.save(layout);
    }
    findAll() {
        return this.layoutRepository.find({
            order: { order: 'ASC' },
            relations: ['categories'],
        });
    }
    findOne(id) {
        return this.layoutRepository.findOne({
            where: { id },
            relations: ['categories'],
        });
    }
    async update(id, updateLayoutDto) {
        const { categoryIds, ...rest } = updateLayoutDto;
        const layout = await this.layoutRepository.findOne({
            where: { id },
            relations: ['categories'],
        });
        if (!layout)
            return null;
        Object.assign(layout, rest);
        const type = updateLayoutDto.type || layout.type;
        if (type === 'hero') {
            layout.categories = [];
        }
        else if (categoryIds) {
            layout.categories = categoryIds.map((id) => ({ id }));
        }
        return this.layoutRepository.save(layout);
    }
    remove(id) {
        return this.layoutRepository.delete(id);
    }
};
exports.LayoutService = LayoutService;
exports.LayoutService = LayoutService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(layout_entity_1.Layout)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LayoutService);
//# sourceMappingURL=layout.service.js.map