import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class DeleteLikeDto {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  filmId: string;
}
