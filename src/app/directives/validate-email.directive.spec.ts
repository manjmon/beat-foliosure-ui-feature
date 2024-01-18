import { CustomEmailValidator } from './validate-email.directive';
import { FormControl } from '@angular/forms';

describe('CustomBusinessNameValidator', () => {
  let formControl: FormControl;
  let validator: CustomEmailValidator;

  beforeEach(() => {
    validator = new CustomEmailValidator('my-email@example.com');
    formControl = new FormControl();
  });

  it('should be valid when the business name is not null and meets the requirements', () => {
    formControl.setValue('john.doe@example.com');

    const errors = validator.validate(formControl);

    expect(errors).toBeNull();
  });

  it('should be invalid when the business name is null', () => {
    formControl.setValue(null);

    const errors = validator.validate(formControl);

    expect(errors).toBeNull();
  });
  it('should be invalid when the email address does not meet the requirements', () => {
    formControl.setValue('johndoe@example');

    const errors = validator.validate(formControl);

    expect(errors).toEqual({
      validateEmail: {
        valid: false
      }
    });
  });

  
});