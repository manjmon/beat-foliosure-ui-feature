import { DndDirective } from './dnd.directive';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('DndDirective', () => {
  let directive: DndDirective;
  let element: ElementRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DndDirective]
    });

    directive = new DndDirective();
  });

  it('should block the paste event', () => {
    const event = new KeyboardEvent('dragover');
    const spy = spyOn(event, 'preventDefault');

    directive.onDragOver(event);

    expect(spy).toHaveBeenCalled();
  });

  it('should block the copy event', () => {
    const event = new KeyboardEvent('dragleave');
    const spy = spyOn(event, 'preventDefault');

    directive.onDragLeave(event);

    expect(spy).toHaveBeenCalled();
  });

});