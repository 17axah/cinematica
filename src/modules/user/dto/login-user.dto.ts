import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  Matches,
  IsNotEmpty,
  IsDefined,
} from 'class-validator';
import { Email } from '~/types';

export class LoginUserDto {
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
}
