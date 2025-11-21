import { IsString, MaxLength, Matches } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(50)
  name!: string;

  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Color must be a valid hex color' })
  color!: string;
}
