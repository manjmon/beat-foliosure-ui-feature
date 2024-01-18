import { CustomRequiredValidator } from './required.directive';
import { FormControl } from '@angular/forms';

describe('CustomRequiredValidator', () => {
  let validator: CustomRequiredValidator;
  let formControl: FormControl;

  beforeEach(() => {
    validator = new CustomRequiredValidator(('my-email@example.com'));
    formControl = new FormControl();
  });

  it('should be valid when the value is not null, not undefined, and not empty', () => {
    formControl.setValue('test');

    const errors = validator.validate(formControl);

    expect(errors).toBeNull();
  });

  it('should be invalid when the value is null', () => {
    formControl.setValue(null);

    const errors = validator.validate(formControl);

    expect(errors).toEqual({ validateRequired: { valid: false } });
  });

  it('should be invalid when the value is undefined', () => {
    formControl.setValue(undefined);

    const errors = validator.validate(formControl);

    expect(errors).toEqual({ validateRequired: { valid: false } });
  });

  it('should be invalid when the value is an empty string', () => {
    formControl.setValue('');

    const errors = validator.validate(formControl);

    expect(errors).toEqual({ validateRequired: { valid: false } });
  });

  it('should be valid when the value is an object with a value', () => {
    formControl.setValue({ test: 'test' });

    const errors = validator.validate(formControl);

    expect(errors).toBeNull();
  });

  it('should be valid when the value is an array with a value', () => {
    formControl.setValue([1]);

    const errors = validator.validate(formControl);

    expect(errors).toBeNull();
  });

  it('should be valid when the value is a date', () => {
    formControl.setValue(new Date());

    const errors = validator.validate(formControl);

    expect(errors).toBeNull();
  });
});