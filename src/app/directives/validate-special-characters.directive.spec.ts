import { InputValidatorDirective } from './validate-special-characters.directive';
import { ElementRef } from '@angular/core';

describe('InputValidatorDirective', () => {
  let directive: InputValidatorDirective;
  let elementRef: ElementRef;

  beforeEach(() => {
    elementRef = new ElementRef('<div></div>');
    directive = new InputValidatorDirective(elementRef);
  });

  describe('integerOnly()', () => {
    it('should allow integer inputs', () => {
      const event = new KeyboardEvent('keydown', { key: '1' });
      directive.inputValidator = 'integer';
      directive.integerOnly(event);
      expect(event.defaultPrevented).toBeFalsy();
    });
  });
  describe('noSpecialChars()', () => {
    it('should allow alphabetic and numeric inputs', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      directive.inputValidator = 'noSpecialChars';
      directive.noSpecialChars(event);
      expect(event.defaultPrevented).toBeFalsy();
    });
  });
  describe('validatePersonName()', () => {
    it('should allow alphabetic and numeric inputs, as well as spaces', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      directive.inputValidator = 'validatePersonName';
      directive.validatePersonName(event);
      expect(event.defaultPrevented).toBeFalsy();
    });

  });
});
