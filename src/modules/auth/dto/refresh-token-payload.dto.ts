import { Exclude, Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';

@Exclude()
export class RefreshTokenPayload {
  @Expose()
  @IsMongoId()
  userId: string;

  @Expose()
  @IsMongoId()
  tokenId: string;
}
