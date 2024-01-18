import { Directive	} from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';

/**
 * This validator works like "required" but it does not allow whitespace either
 *
 * @export
 * @class NoWhitespaceDirective
 * @implements {Validator}
 */
@Directive({
	selector: '[nfNoSpaces]',
	providers: [{ provide: NG_VALIDATORS, useExisting: NoWhitespaceDirective, multi: true }]
})
export class NoWhitespaceDirective implements Validator {

	private valFn = NoWhitespaceValidator();
	validate(control: AbstractControl): { [key: string]: any } {
		return this.valFn(control);
	}
}
export function NoWhitespaceValidator(): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } => {
		let isWhitespace = (control.value || '').trim().length === 0;
		let isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': 'value is only whitespace' }
	};
}
