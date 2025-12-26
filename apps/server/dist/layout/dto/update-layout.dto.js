"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLayoutDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_layout_dto_1 = require("./create-layout.dto");
class UpdateLayoutDto extends (0, mapped_types_1.PartialType)(create_layout_dto_1.CreateLayoutDto) {
}
exports.UpdateLayoutDto = UpdateLayoutDto;
//# sourceMappingURL=update-layout.dto.js.map