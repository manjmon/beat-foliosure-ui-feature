import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MustMatch } from './MustMatch-validator';
import { TestBed } from '@angular/core/testing';

describe('MustMatchValidator', () => {
    let formGroup: FormGroup;
    let pipe: Validators;

    beforeEach(() => {
        formGroup = new FormGroup({
            controlName: new FormControl('', [Validators.required]),
            matchingControlName: new FormControl('', [Validators.required]),
        });
        pipe = new Validators();
    TestBed.configureTestingModule({ providers: [Validators] });

    });
    it('can load instance', () => {
        expect(pipe).toBeTruthy();
      });
  

    it('should return null if another validator has already found an error on the matchingControl', () => {
        const validator = MustMatch(['controlName', 'matchingControlName']);

        formGroup.get('matchingControlName').setErrors({ required: true });

        const errors = validator(formGroup);

        expect(errors).toBeNull();
    });


});