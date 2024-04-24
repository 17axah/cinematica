import {
  BadRequestException,
  HttpStatus,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

function mapErrors(validationErrors: ValidationError[]) {
  const errors = validationErrors.map(({ property, children, constraints }) => [
    property,
    children && children.length ? mapErrors(children) : constraints,
  ]);

  return Object.fromEntries(errors);
}

export const validationPipe = new ValidationPipe({
  stopAtFirstError: false,
  skipUndefinedProperties: true,
  whitelist: true,
  exceptionFactory: (validationErrors: ValidationError[]) => {
    return new BadRequestException({
      validationError: true,
      messages: mapErrors(validationErrors),
      statusCode: HttpStatus.BAD_REQUEST,
    });
  },
});
