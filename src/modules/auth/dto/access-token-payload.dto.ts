import { Exclude, Expose } from 'class-transformer';
import { IsMongoId, IsString, IsArray } from 'class-validator';

@Exclude()
export class AccessTokenPayload {
  @Expose()
  @IsMongoId()
  id: string;

  @Expose()
  @IsMongoId()
  email: string;

  @Expose()
  @IsMongoId()
  avatar: string;

  @Expose()
  @IsMongoId()
  name: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  roles: string[];
}
