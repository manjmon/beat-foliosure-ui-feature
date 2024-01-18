import { BlockCutCopyPasteDirective } from './block-cutcopypaste.directive';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('BlockCutCopyPasteDirective', () => {
  let directive: BlockCutCopyPasteDirective;
  let element: ElementRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockCutCopyPasteDirective]
    });

    directive = new BlockCutCopyPasteDirective();
  });

  it('should block the paste event', () => {
    const event = new KeyboardEvent('paste');
    const spy = spyOn(event, 'preventDefault');

    directive.blockPaste(event);

    expect(spy).toHaveBeenCalled();
  });

  it('should block the copy event', () => {
    const event = new KeyboardEvent('copy');
    const spy = spyOn(event, 'preventDefault');

    directive.blockCopy(event);

    expect(spy).toHaveBeenCalled();
  });

  it('should block the cut event', () => {
    const event = new KeyboardEvent('cut');
    const spy = spyOn(event, 'preventDefault');

    directive.blockCut(event);

    expect(spy).toHaveBeenCalled();
  });
});