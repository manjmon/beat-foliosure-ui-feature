import { NumberOnlyDirective } from './validate-numbers.directive';
import { ElementRef } from '@angular/core';

describe('NumberOnlyDirective', () => {
  let directive: NumberOnlyDirective;
  let el: ElementRef;

  beforeEach(() => {
    el = jasmine.createSpyObj('ElementRef', ['nativeElement']);
    el.nativeElement.value = '';
    directive = new NumberOnlyDirective(el);
  });

 
  it('should allow backspace, tab, end, and home keys to be pressed', () => {
    directive.onKeyDown({
      key: 'Backspace',
      altKey: false,
      charCode: 0,
      code: '',
      ctrlKey: false,
      isComposing: false,
      keyCode: 0,
      location: 0,
      metaKey: false,
      repeat: false,
      shiftKey: false,
      getModifierState: function (keyArg: string): boolean {
        throw new Error('Function not implemented.');
      },
      initKeyboardEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, keyArg?: string, locationArg?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, metaKey?: boolean): void {
        throw new Error('Function not implemented.');
      },
      DOM_KEY_LOCATION_STANDARD: 0,
      DOM_KEY_LOCATION_LEFT: 1,
      DOM_KEY_LOCATION_RIGHT: 2,
      DOM_KEY_LOCATION_NUMPAD: 3,
      detail: 0,
      view: undefined,
      which: 0,
      initUIEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number): void {
        throw new Error('Function not implemented.');
      },
      bubbles: false,
      cancelBubble: false,
      cancelable: false,
      composed: false,
      currentTarget: undefined,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      returnValue: false,
      srcElement: undefined,
      target: undefined,
      timeStamp: 0,
      type: '',
      composedPath: function (): EventTarget[] {
        throw new Error('Function not implemented.');
      },
      initEvent: function (type: string, bubbles?: boolean, cancelable?: boolean): void {
        throw new Error('Function not implemented.');
      },
      preventDefault: function (): void {
        throw new Error('Function not implemented.');
      },
      stopImmediatePropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      stopPropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      NONE: 0,
      CAPTURING_PHASE: 1,
      AT_TARGET: 2,
      BUBBLING_PHASE: 3
    });
    directive.onKeyDown({
      key: 'Tab',
      altKey: false,
      charCode: 0,
      code: '',
      ctrlKey: false,
      isComposing: false,
      keyCode: 0,
      location: 0,
      metaKey: false,
      repeat: false,
      shiftKey: false,
      getModifierState: function (keyArg: string): boolean {
        throw new Error('Function not implemented.');
      },
      initKeyboardEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, keyArg?: string, locationArg?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, metaKey?: boolean): void {
        throw new Error('Function not implemented.');
      },
      DOM_KEY_LOCATION_STANDARD: 0,
      DOM_KEY_LOCATION_LEFT: 1,
      DOM_KEY_LOCATION_RIGHT: 2,
      DOM_KEY_LOCATION_NUMPAD: 3,
      detail: 0,
      view: undefined,
      which: 0,
      initUIEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number): void {
        throw new Error('Function not implemented.');
      },
      bubbles: false,
      cancelBubble: false,
      cancelable: false,
      composed: false,
      currentTarget: undefined,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      returnValue: false,
      srcElement: undefined,
      target: undefined,
      timeStamp: 0,
      type: '',
      composedPath: function (): EventTarget[] {
        throw new Error('Function not implemented.');
      },
      initEvent: function (type: string, bubbles?: boolean, cancelable?: boolean): void {
        throw new Error('Function not implemented.');
      },
      preventDefault: function (): void {
        throw new Error('Function not implemented.');
      },
      stopImmediatePropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      stopPropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      NONE: 0,
      CAPTURING_PHASE: 1,
      AT_TARGET: 2,
      BUBBLING_PHASE: 3
    });
    directive.onKeyDown({
      key: 'End',
      altKey: false,
      charCode: 0,
      code: '',
      ctrlKey: false,
      isComposing: false,
      keyCode: 0,
      location: 0,
      metaKey: false,
      repeat: false,
      shiftKey: false,
      getModifierState: function (keyArg: string): boolean {
        throw new Error('Function not implemented.');
      },
      initKeyboardEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, keyArg?: string, locationArg?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, metaKey?: boolean): void {
        throw new Error('Function not implemented.');
      },
      DOM_KEY_LOCATION_STANDARD: 0,
      DOM_KEY_LOCATION_LEFT: 1,
      DOM_KEY_LOCATION_RIGHT: 2,
      DOM_KEY_LOCATION_NUMPAD: 3,
      detail: 0,
      view: undefined,
      which: 0,
      initUIEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number): void {
        throw new Error('Function not implemented.');
      },
      bubbles: false,
      cancelBubble: false,
      cancelable: false,
      composed: false,
      currentTarget: undefined,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      returnValue: false,
      srcElement: undefined,
      target: undefined,
      timeStamp: 0,
      type: '',
      composedPath: function (): EventTarget[] {
        throw new Error('Function not implemented.');
      },
      initEvent: function (type: string, bubbles?: boolean, cancelable?: boolean): void {
        throw new Error('Function not implemented.');
      },
      preventDefault: function (): void {
        throw new Error('Function not implemented.');
      },
      stopImmediatePropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      stopPropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      NONE: 0,
      CAPTURING_PHASE: 1,
      AT_TARGET: 2,
      BUBBLING_PHASE: 3
    });
    directive.onKeyDown({
      key: 'Home',
      altKey: false,
      charCode: 0,
      code: '',
      ctrlKey: false,
      isComposing: false,
      keyCode: 0,
      location: 0,
      metaKey: false,
      repeat: false,
      shiftKey: false,
      getModifierState: function (keyArg: string): boolean {
        throw new Error('Function not implemented.');
      },
      initKeyboardEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, keyArg?: string, locationArg?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, metaKey?: boolean): void {
        throw new Error('Function not implemented.');
      },
      DOM_KEY_LOCATION_STANDARD: 0,
      DOM_KEY_LOCATION_LEFT: 1,
      DOM_KEY_LOCATION_RIGHT: 2,
      DOM_KEY_LOCATION_NUMPAD: 3,
      detail: 0,
      view: undefined,
      which: 0,
      initUIEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number): void {
        throw new Error('Function not implemented.');
      },
      bubbles: false,
      cancelBubble: false,
      cancelable: false,
      composed: false,
      currentTarget: undefined,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      returnValue: false,
      srcElement: undefined,
      target: undefined,
      timeStamp: 0,
      type: '',
      composedPath: function (): EventTarget[] {
        throw new Error('Function not implemented.');
      },
      initEvent: function (type: string, bubbles?: boolean, cancelable?: boolean): void {
        throw new Error('Function not implemented.');
      },
      preventDefault: function (): void {
        throw new Error('Function not implemented.');
      },
      stopImmediatePropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      stopPropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      NONE: 0,
      CAPTURING_PHASE: 1,
      AT_TARGET: 2,
      BUBBLING_PHASE: 3
    });

    expect(el.nativeElement.value).toBe('');
  });

  it('should allow arrow keys to be pressed', () => {
    directive.onKeyDown({
      key: 'ArrowRight',
      altKey: false,
      charCode: 0,
      code: '',
      ctrlKey: false,
      isComposing: false,
      keyCode: 0,
      location: 0,
      metaKey: false,
      repeat: false,
      shiftKey: false,
      getModifierState: function (keyArg: string): boolean {
        throw new Error('Function not implemented.');
      },
      initKeyboardEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, keyArg?: string, locationArg?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, metaKey?: boolean): void {
        throw new Error('Function not implemented.');
      },
      DOM_KEY_LOCATION_STANDARD: 0,
      DOM_KEY_LOCATION_LEFT: 1,
      DOM_KEY_LOCATION_RIGHT: 2,
      DOM_KEY_LOCATION_NUMPAD: 3,
      detail: 0,
      view: undefined,
      which: 0,
      initUIEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number): void {
        throw new Error('Function not implemented.');
      },
      bubbles: false,
      cancelBubble: false,
      cancelable: false,
      composed: false,
      currentTarget: undefined,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      returnValue: false,
      srcElement: undefined,
      target: undefined,
      timeStamp: 0,
      type: '',
      composedPath: function (): EventTarget[] {
        throw new Error('Function not implemented.');
      },
      initEvent: function (type: string, bubbles?: boolean, cancelable?: boolean): void {
        throw new Error('Function not implemented.');
      },
      preventDefault: function (): void {
        throw new Error('Function not implemented.');
      },
      stopImmediatePropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      stopPropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      NONE: 0,
      CAPTURING_PHASE: 1,
      AT_TARGET: 2,
      BUBBLING_PHASE: 3
    });
    directive.onKeyDown({
      key: 'ArrowLeft',
      altKey: false,
      charCode: 0,
      code: '',
      ctrlKey: false,
      isComposing: false,
      keyCode: 0,
      location: 0,
      metaKey: false,
      repeat: false,
      shiftKey: false,
      getModifierState: function (keyArg: string): boolean {
        throw new Error('Function not implemented.');
      },
      initKeyboardEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, keyArg?: string, locationArg?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, metaKey?: boolean): void {
        throw new Error('Function not implemented.');
      },
      DOM_KEY_LOCATION_STANDARD: 0,
      DOM_KEY_LOCATION_LEFT: 1,
      DOM_KEY_LOCATION_RIGHT: 2,
      DOM_KEY_LOCATION_NUMPAD: 3,
      detail: 0,
      view: undefined,
      which: 0,
      initUIEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number): void {
        throw new Error('Function not implemented.');
      },
      bubbles: false,
      cancelBubble: false,
      cancelable: false,
      composed: false,
      currentTarget: undefined,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      returnValue: false,
      srcElement: undefined,
      target: undefined,
      timeStamp: 0,
      type: '',
      composedPath: function (): EventTarget[] {
        throw new Error('Function not implemented.');
      },
      initEvent: function (type: string, bubbles?: boolean, cancelable?: boolean): void {
        throw new Error('Function not implemented.');
      },
      preventDefault: function (): void {
        throw new Error('Function not implemented.');
      },
      stopImmediatePropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      stopPropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      NONE: 0,
      CAPTURING_PHASE: 1,
      AT_TARGET: 2,
      BUBBLING_PHASE: 3
    });

    expect(el.nativeElement.value).toBe('');
  });

  
  it('should allow ctrl+a, ctrl+c, ctrl+v, and ctrl+x to be used', () => {
    directive.onKeyDown({
      key: 'a', ctrlKey: true,
      altKey: false,
      charCode: 0,
      code: '',
      isComposing: false,
      keyCode: 0,
      location: 0,
      metaKey: false,
      repeat: false,
      shiftKey: false,
      getModifierState: function (keyArg: string): boolean {
        throw new Error('Function not implemented.');
      },
      initKeyboardEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, keyArg?: string, locationArg?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, metaKey?: boolean): void {
        throw new Error('Function not implemented.');
      },
      DOM_KEY_LOCATION_STANDARD: 0,
      DOM_KEY_LOCATION_LEFT: 1,
      DOM_KEY_LOCATION_RIGHT: 2,
      DOM_KEY_LOCATION_NUMPAD: 3,
      detail: 0,
      view: undefined,
      which: 0,
      initUIEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number): void {
        throw new Error('Function not implemented.');
      },
      bubbles: false,
      cancelBubble: false,
      cancelable: false,
      composed: false,
      currentTarget: undefined,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      returnValue: false,
      srcElement: undefined,
      target: undefined,
      timeStamp: 0,
      type: '',
      composedPath: function (): EventTarget[] {
        throw new Error('Function not implemented.');
      },
      initEvent: function (type: string, bubbles?: boolean, cancelable?: boolean): void {
        throw new Error('Function not implemented.');
      },
      preventDefault: function (): void {
        throw new Error('Function not implemented.');
      },
      stopImmediatePropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      stopPropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      NONE: 0,
      CAPTURING_PHASE: 1,
      AT_TARGET: 2,
      BUBBLING_PHASE: 3
    });
    directive.onKeyDown({
      key: 'c', ctrlKey: true,
      altKey: false,
      charCode: 0,
      code: '',
      isComposing: false,
      keyCode: 0,
      location: 0,
      metaKey: false,
      repeat: false,
      shiftKey: false,
      getModifierState: function (keyArg: string): boolean {
        throw new Error('Function not implemented.');
      },
      initKeyboardEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, keyArg?: string, locationArg?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, metaKey?: boolean): void {
        throw new Error('Function not implemented.');
      },
      DOM_KEY_LOCATION_STANDARD: 0,
      DOM_KEY_LOCATION_LEFT: 1,
      DOM_KEY_LOCATION_RIGHT: 2,
      DOM_KEY_LOCATION_NUMPAD: 3,
      detail: 0,
      view: undefined,
      which: 0,
      initUIEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number): void {
        throw new Error('Function not implemented.');
      },
      bubbles: false,
      cancelBubble: false,
      cancelable: false,
      composed: false,
      currentTarget: undefined,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      returnValue: false,
      srcElement: undefined,
      target: undefined,
      timeStamp: 0,
      type: '',
      composedPath: function (): EventTarget[] {
        throw new Error('Function not implemented.');
      },
      initEvent: function (type: string, bubbles?: boolean, cancelable?: boolean): void {
        throw new Error('Function not implemented.');
      },
      preventDefault: function (): void {
        throw new Error('Function not implemented.');
      },
      stopImmediatePropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      stopPropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      NONE: 0,
      CAPTURING_PHASE: 1,
      AT_TARGET: 2,
      BUBBLING_PHASE: 3
    });
    directive.onKeyDown({
      key: 'v', ctrlKey: true,
      altKey: false,
      charCode: 0,
      code: '',
      isComposing: false,
      keyCode: 0,
      location: 0,
      metaKey: false,
      repeat: false,
      shiftKey: false,
      getModifierState: function (keyArg: string): boolean {
        throw new Error('Function not implemented.');
      },
      initKeyboardEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, keyArg?: string, locationArg?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, metaKey?: boolean): void {
        throw new Error('Function not implemented.');
      },
      DOM_KEY_LOCATION_STANDARD: 0,
      DOM_KEY_LOCATION_LEFT: 1,
      DOM_KEY_LOCATION_RIGHT: 2,
      DOM_KEY_LOCATION_NUMPAD: 3,
      detail: 0,
      view: undefined,
      which: 0,
      initUIEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number): void {
        throw new Error('Function not implemented.');
      },
      bubbles: false,
      cancelBubble: false,
      cancelable: false,
      composed: false,
      currentTarget: undefined,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      returnValue: false,
      srcElement: undefined,
      target: undefined,
      timeStamp: 0,
      type: '',
      composedPath: function (): EventTarget[] {
        throw new Error('Function not implemented.');
      },
      initEvent: function (type: string, bubbles?: boolean, cancelable?: boolean): void {
        throw new Error('Function not implemented.');
      },
      preventDefault: function (): void {
        throw new Error('Function not implemented.');
      },
      stopImmediatePropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      stopPropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      NONE: 0,
      CAPTURING_PHASE: 1,
      AT_TARGET: 2,
      BUBBLING_PHASE: 3
    });
    directive.onKeyDown({
      key: 'x', ctrlKey: true,
      altKey: false,
      charCode: 0,
      code: '',
      isComposing: false,
      keyCode: 0,
      location: 0,
      metaKey: false,
      repeat: false,
      shiftKey: false,
      getModifierState: function (keyArg: string): boolean {
        throw new Error('Function not implemented.');
      },
      initKeyboardEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, keyArg?: string, locationArg?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, metaKey?: boolean): void {
        throw new Error('Function not implemented.');
      },
      DOM_KEY_LOCATION_STANDARD: 0,
      DOM_KEY_LOCATION_LEFT: 1,
      DOM_KEY_LOCATION_RIGHT: 2,
      DOM_KEY_LOCATION_NUMPAD: 3,
      detail: 0,
      view: undefined,
      which: 0,
      initUIEvent: function (typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number): void {
        throw new Error('Function not implemented.');
      },
      bubbles: false,
      cancelBubble: false,
      cancelable: false,
      composed: false,
      currentTarget: undefined,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      returnValue: false,
      srcElement: undefined,
      target: undefined,
      timeStamp: 0,
      type: '',
      composedPath: function (): EventTarget[] {
        throw new Error('Function not implemented.');
      },
      initEvent: function (type: string, bubbles?: boolean, cancelable?: boolean): void {
        throw new Error('Function not implemented.');
      },
      preventDefault: function (): void {
        throw new Error('Function not implemented.');
      },
      stopImmediatePropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      stopPropagation: function (): void {
        throw new Error('Function not implemented.');
      },
      NONE: 0,
      CAPTURING_PHASE: 1,
      AT_TARGET: 2,
      BUBBLING_PHASE: 3
    });

    expect(el.nativeElement.value).toBe('');
  });
});