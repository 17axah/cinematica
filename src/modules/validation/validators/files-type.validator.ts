import { FileValidator } from '@nestjs/common';

export class FilesTypeValidator extends FileValidator {
  isValid(file: Express.Multer.File) {
    return Boolean(file.mimetype.match(this.validationOptions.fileType));
  }

  buildErrorMessage() {
    return `Validation failed (expected type is ${this.validationOptions.fileType})`;
  }
}
