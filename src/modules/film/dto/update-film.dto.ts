import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  Max,
  IsArray,
  IsOptional,
} from 'class-validator';

export class UpdateFilmDto {
  @ApiProperty({ required: false })
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ApiProperty({ required: false, maxLength: 500 })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Max(18)
  rate?: number;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  genres?: string[];
}
