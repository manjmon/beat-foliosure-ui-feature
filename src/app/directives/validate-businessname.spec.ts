import { CustomBusinessNameValidator } from './validate-businessname';
import { FormControl } from '@angular/forms';

describe('CustomBusinessNameValidator', () => {
  let formControl: FormControl;
  let validator: CustomBusinessNameValidator;

  beforeEach(() => {
    validator = new CustomBusinessNameValidator('my-email@example.com');
    formControl = new FormControl();
  });

  it('should be valid when the business name is not null and meets the requirements', () => {
    formControl.setValue('Acme Corporation');

    const errors = validator.validate(formControl);

    expect(errors).toBeNull();
  });

  it('should be invalid when the business name is null', () => {
    formControl.setValue(null);

    const errors = validator.validate(formControl);

    expect(errors).toBeNull();
  });

  
});