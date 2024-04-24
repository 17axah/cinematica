import { FileValidator } from '@nestjs/common';

export class MaxFilesSizeValidator extends FileValidator {
  isValid(file: Express.Multer.File) {
    return file.size < this.validationOptions.maxSize;
  }

  buildErrorMessage() {
    return `Validation failed (expected size is less than ${this.validationOptions.maxSize})`;
  }
}
