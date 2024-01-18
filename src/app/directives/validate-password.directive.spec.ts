import { PasswordValidator } from './validate-password.directive';
import { FormControl, FormGroup } from '@angular/forms';
import { ComparePassword } from './validate-password.directive';

describe('PasswordValidator', () => {
  let formControl: FormControl;
  let validator: PasswordValidator;

  beforeEach(() => {
    validator = new PasswordValidator('my-email@example.com');
    formControl = new FormControl();
  });

  it('should be valid when the password is not null and meets the requirements', () => {
    formControl.setValue('P@ssw0rd');

    const errors = validator.validate(formControl);

    expect(errors).toBeNull();
  });
  it('should be invalid when the password does not meet the requirements', () => {
    formControl.setValue('password');

    const errors = validator.validate(formControl);

    expect(errors).toEqual({
      validatePassword: {
        valid: false
      }
    });
  });
  it('should be invalid when the password is less than 7 characters', () => {
    formControl.setValue('Pas123');

    const errors = validator.validate(formControl);

    expect(errors).toEqual({
      validatePassword: {
        valid: false
      }
    });
  });
  it('should be invalid when the password is more than 15 characters', () => {
    formControl.setValue('P@ssw0rd1234567890');

    const errors = validator.validate(formControl);

    expect(errors).toEqual({
      validatePassword: {
        valid: false
      }
    });
  });
  it('should be invalid when the password does not contain an uppercase letter', () => {
    formControl.setValue('passw0rd');

    const errors = validator.validate(formControl);

    expect(errors).toEqual({
      validatePassword: {
        valid: false
      }
    });
  });
  
});