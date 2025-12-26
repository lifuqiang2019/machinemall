import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LayoutService } from './layout.service';
import { CreateLayoutDto } from './dto/create-layout.dto';
import { UpdateLayoutDto } from './dto/update-layout.dto';

@Controller('layout')
export class LayoutController {
  constructor(private readonly layoutService: LayoutService) {}

  @Post()
  create(@Body() createLayoutDto: CreateLayoutDto) {
    return this.layoutService.create(createLayoutDto);
  }

  @Get()
  findAll() {
    return this.layoutService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.layoutService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLayoutDto: UpdateLayoutDto) {
    try {
        return await this.layoutService.update(+id, updateLayoutDto);
    } catch (error) {
        console.error('Update Layout Error:', error);
        throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.layoutService.remove(+id);
  }
}
