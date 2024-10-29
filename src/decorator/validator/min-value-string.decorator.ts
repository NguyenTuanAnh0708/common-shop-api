import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'minValueString', async: false })
export class MinValueStringConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: any) {
    const minValue = args.constraints[0];
    return value && !isNaN(Number(value)) && Number(value) >= minValue;
  }

  defaultMessage(args: any) {
    return `${args.property} must be greater than or equal to ${args.constraints[0]}`;
  }
}

export function MinValueString(
  minValue: number,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'minValueString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [minValue],
      options: validationOptions,
      validator: MinValueStringConstraint,
    });
  };
}
