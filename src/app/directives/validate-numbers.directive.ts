import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[numberOnly]'
})
export class NumberOnlyDirective {
    // Allow decimal numbers and negative values
    //private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);

    private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]{0,2})?$/g);


    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home','ArrowRight','Delete','ArrowLeft','Shift'];

    constructor(private el: ElementRef) {
    }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {            
            return;
        }
        let current: string = this.el.nativeElement.value;
        let next: string = current.concat(event.key);

        if(
        (event.key.toLocaleLowerCase() == 'a' && event.ctrlKey === true) || // Allow: Ctrl+A
        (event.key.toLocaleLowerCase() == 'c' && event.ctrlKey === true) || // Allow: Ctrl+C
        (event.key.toLocaleLowerCase() == 'v' && event.ctrlKey === true) || // Allow: Ctrl+V
        (event.key.toLocaleLowerCase() == 'x' && event.ctrlKey === true)    // Allow: Ctrl+X
        ){          
            return;
        }

        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
    @HostListener('blur', ['$event'])
    onBlur(event: any) {
        let current: string = this.el.nativeElement.value;
        if (!String(current).match(this.regex)) {
            current = "";
            this.el.nativeElement.value = current;
        }
        if (current.substr(current.length - 1) == '.') {
            this.el.nativeElement.value = current.substr(0, current.length - 1);
        }
    }

}