import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDefined,
  MaxLength,
  IsNumber,
  Max,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateFilmDto {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: false, maxLength: 500 })
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Max(18)
  rate?: number;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  genres?: string[];
}
