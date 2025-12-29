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

  async create(createLayoutDto: CreateLayoutDto) {
    const { categoryIds, ...rest } = createLayoutDto;
    const layout = this.layoutRepository.create(rest);
    if (categoryIds && categoryIds.length > 0) {
      layout.categories = categoryIds.map((id) => ({ id } as any));
    }
    return this.layoutRepository.save(layout);
  }

  findAll() {
    return this.layoutRepository.find({
      order: { order: 'ASC' },
      relations: ['categories'],
    });
  }

  findOne(id: number) {
    return this.layoutRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
  }

  async update(id: number, updateLayoutDto: UpdateLayoutDto) {
    const { categoryIds, ...rest } = updateLayoutDto;
    const layout = await this.layoutRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!layout) return null;

    Object.assign(layout, rest);

    const type = updateLayoutDto.type || layout.type;
    if (type === 'hero') {
      layout.categories = [];
    } else if (categoryIds) {
      layout.categories = categoryIds.map((id) => ({ id } as any));
    }

    return this.layoutRepository.save(layout);
  }

  remove(id: number) {
    return this.layoutRepository.delete(id);
  }
}
