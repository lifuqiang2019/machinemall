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
exports.LayoutController = void 0;
const common_1 = require("@nestjs/common");
const layout_service_1 = require("./layout.service");
const create_layout_dto_1 = require("./dto/create-layout.dto");
const update_layout_dto_1 = require("./dto/update-layout.dto");
let LayoutController = class LayoutController {
    layoutService;
    constructor(layoutService) {
        this.layoutService = layoutService;
    }
    create(createLayoutDto) {
        return this.layoutService.create(createLayoutDto);
    }
    findAll() {
        return this.layoutService.findAll();
    }
    findOne(id) {
        return this.layoutService.findOne(+id);
    }
    async update(id, updateLayoutDto) {
        try {
            return await this.layoutService.update(+id, updateLayoutDto);
        }
        catch (error) {
            console.error('Update Layout Error:', error);
            throw error;
        }
    }
    remove(id) {
        return this.layoutService.remove(+id);
    }
};
exports.LayoutController = LayoutController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_layout_dto_1.CreateLayoutDto]),
    __metadata("design:returntype", void 0)
], LayoutController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LayoutController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LayoutController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_layout_dto_1.UpdateLayoutDto]),
    __metadata("design:returntype", Promise)
], LayoutController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LayoutController.prototype, "remove", null);
exports.LayoutController = LayoutController = __decorate([
    (0, common_1.Controller)('layout'),
    __metadata("design:paramtypes", [layout_service_1.LayoutService])
], LayoutController);
//# sourceMappingURL=layout.controller.js.map