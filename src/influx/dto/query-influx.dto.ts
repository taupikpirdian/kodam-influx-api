import { IsString } from 'class-validator';

export class QueryInfluxDto {
  @IsString()
  q!: string;
}