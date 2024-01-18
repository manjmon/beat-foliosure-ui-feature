import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

@Directive({
    selector: '[tagValidator]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: TagsValidator,
        multi: true
    }]
})
export class TagsValidator implements Validator {
    @Input('tagValidator') tags: string[];

    validate(control: FormControl) {
        const hasTag = this.tags.indexOf(control.value==null?control.value:control.value.toLowerCase()) > -1;
        // console.log( hasTag==true
        //     ? { duplicateTags: true }
        //     : null)
        return hasTag
            ? { duplicateTags: true }
            : null;
    }
}