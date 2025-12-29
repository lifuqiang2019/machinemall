import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class Layout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // 模块名称

  @Column({ default: 'product_section' })
  type: string; // 模块类型: 'hero' | 'product_section'

  @Column({ default: 0 })
  order: number; // 排序

  @Column({ default: true })
  isActive: boolean; // 是否显示

  @Column('simple-json', { nullable: true })
  config: any; // Store extra config like carousel slides or section specific settings

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];
}
