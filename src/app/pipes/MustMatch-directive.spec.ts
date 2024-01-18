import { MustMatchDirective } from './MustMatch-directive';
import { FormGroup, FormControl, Validators } from '@angular/forms';

describe('MustMatchDirective', () => {
  let directive: MustMatchDirective;
  let formGroup: FormGroup;

  beforeEach(() => {
    directive = new MustMatchDirective();
    formGroup = new FormGroup({
      controlName: new FormControl('', [Validators.required]),
      matchingControlName: new FormControl('', [Validators.required]),
    });
  });

 

  it('should clear the error on the matchingControl if the values match', () => {
    directive.mustMatch = ['controlName', 'matchingControlName'];

    formGroup.get('controlName').setValue('password1');
    formGroup.get('matchingControlName').setValue('password1');

    formGroup.markAllAsTouched();

    expect(formGroup.get('matchingControlName').errors).toBeNull();
  });
});