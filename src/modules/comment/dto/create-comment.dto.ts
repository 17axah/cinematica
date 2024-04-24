import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDefined, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  filmId: string;

  @ApiProperty({ required: false, maxLength: 500 })
  @IsString()
  @MaxLength(500)
  message?: string;
}
