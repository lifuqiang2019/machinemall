export class CreateLayoutDto {
  name: string;
  type?: string;
  order?: number;
  isActive?: boolean;
  categoryId?: number | null;
}
