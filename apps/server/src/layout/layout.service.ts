import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Layout } from './entities/layout.entity';
import { CreateLayoutDto } from './dto/create-layout.dto';
import { UpdateLayoutDto } from './dto/update-layout.dto';

@Injectable()
export class LayoutService {
  constructor(
    @InjectRepository(Layout)
    private layoutRepository: Repository<Layout>,
  ) {}

  create(createLayoutDto: CreateLayoutDto) {
    // Cast to any to bypass strict type check for null/undefined mismatch in DeepPartial
    const layout = this.layoutRepository.create(createLayoutDto as any);
    return this.layoutRepository.save(layout);
  }

  findAll() {
    return this.layoutRepository.find({
      order: { order: 'ASC' },
      relations: ['category'],
    });
  }

  findOne(id: number) {
    return this.layoutRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async update(id: number, updateLayoutDto: UpdateLayoutDto) {
    // Handle categoryId explicitly if it's meant to be cleared
    if (updateLayoutDto.type !== 'product_section') {
        updateLayoutDto.categoryId = null;
    }
    return this.layoutRepository.update(id, updateLayoutDto as any);
  }

  remove(id: number) {
    return this.layoutRepository.delete(id);
  }
}
