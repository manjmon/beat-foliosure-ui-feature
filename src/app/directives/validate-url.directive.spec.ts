import { CustomURLValidator } from './validate-url.directive';
import { FormControl, Validators } from '@angular/forms';

describe('CustomURLValidatorDirective', () => {
  let validator: CustomURLValidator;
  let control: FormControl;

  beforeEach(() => {
    validator = new CustomURLValidator('');
    control = new FormControl('', Validators.compose([validator.validate]));
  });

  
  it('should invalidate an invalid URL', () => {
    control.setValue('invalid://example.com');

    expect(validator.validate(control)).toEqual({
      validateURL: {
        valid: false,
      },
    });
  });

  it('should validate an empty URL', () => {
    control.setValue('');

    expect(validator.validate(control)).toBeNull();
  });

  it('should validate a null URL', () => {
    control.setValue(null);

    expect(validator.validate(control)).toBeNull();
  });
});