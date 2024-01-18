// import { TwoDigitDecimaNumberDirective } from './decimal-number.directive';
// import { ElementRef } from '@angular/core';

// describe('TwoDigitDecimaNumberDirective', () => {
//   let directive: TwoDigitDecimaNumberDirective;
//   let el: ElementRef;

//   beforeEach(() => {
//     el = jasmine.createSpyObj('ElementRef', ['nativeElement']);
//     el.nativeElement.value = '';
//     directive = new TwoDigitDecimaNumberDirective(el);
//   });

//   it('should create an instance', () => {
//     expect(directive).toBeTruthy();
//   });

//   it('should allow decimal numbers and negative values', () => {
//     const event = new KeyboardEvent('keydown', {
//       key: '1',
//       keyCode: 49,
//       charCode: 49,
//     });
//     directive.onKeyDown(event);
//     expect(event.preventDefault).not.toHaveBeenCalled();

//     const invalidEvent = new KeyboardEvent('keydown', {
//       key: 'A',
//       keyCode: 65,
//       charCode: 65,
//     });
//     directive.onKeyDown(invalidEvent);
//     expect(invalidEvent.preventDefault).toHaveBeenCalled();
//   });

//   it('should allow special keys to be pressed', () => {
//     const specialKeys = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
//     specialKeys.forEach((key) => {
//       const event = new KeyboardEvent('keydown', {
//         key,
//         keyCode: 0,
//         charCode: 0,
//       });
//       directive.onKeyDown(event);
//       expect(event.preventDefault).not.toHaveBeenCalled();
//     });
//   });

//   // Add more test cases here as needed

// });