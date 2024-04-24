import { ApiProperty } from '@nestjs/swagger';

export class PhotosUploadDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: any[];
}
