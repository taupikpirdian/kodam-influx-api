import { IsObject, IsOptional, IsString } from 'class-validator';

export class WriteInfluxDto {
  @IsString()
  measurement!: string;

  @IsObject()
  fields!: Record<string, any>;

  @IsOptional()
  @IsObject()
  tags?: Record<string, any>;
}