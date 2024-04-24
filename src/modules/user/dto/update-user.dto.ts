import { IsString, MaxLength, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false, maxLength: 15 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(15)
  name?: string;
}
