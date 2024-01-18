import { Directive, Attribute, forwardRef } from '@angular/core';
import { NG_VALIDATORS, FormControl, Validator } from '@angular/forms';

@Directive({
	selector: '[validateBusinessName][ngModel]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => CustomBusinessNameValidator),
			multi: true
		}
	]
})
export class CustomBusinessNameValidator implements Validator {
	constructor(@Attribute('validateBusinessName') public validateEmail: string) { }

	//emailPattern: string = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	pattern: any = /^(?!\s)(?!.*\s$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9 '&()-\/,_ ]{2,}$/;

	validate(c: FormControl): { [key: string]: any } | null {

		if (c.value != null) {
			let isValid = this.pattern.test(c.value);
			if (isValid) {
				return null;
			} else {
				return {
					validateBusinessName: {
						valid: false
					}
				}
			}
		}
		else {
			return null;
		}
	}

}
