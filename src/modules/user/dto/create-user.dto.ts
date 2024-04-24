import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  Matches,
  IsNotEmpty,
  IsDefined,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Email } from '~/types';

export class CreateUserDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: Email;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=[A-Za-z\d@$!%*#?&^_-]*[A-Za-z])(?=[A-Za-z\d@$!%*#?&^_-]*\d)(?!.*\s).{6,}/,
    {
      message:
        'The password must be at least 6 characters long, contain Latin letters, at least 1 number, and contain no spaces. Allowed special characters: @$!%*#?&^_-',
    },
  )
  password: string;

  @ApiProperty({ required: false, maxLength: 15 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(15)
  name?: string;
}
