import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DateObjectUnits, DateTime } from 'luxon';

@ValidatorConstraint({ name: 'isDateObject', async: false })
export class IsDateObjectConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: DateObjectUnits) {
    try {
      return propertyValue && DateTime.fromObject(propertyValue).isValid;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an object containing 'year', 'month', 'day' and be a valid date`;
  }
}

export function IsDateObject(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsDateObjectConstraint,
    });
  };
}
