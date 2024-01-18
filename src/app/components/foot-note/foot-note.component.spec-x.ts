import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,SimpleChanges } from '@angular/core';
import { FootNoteService } from 'src/app/services/foot-note.service';
import { FormsModule } from '@angular/forms';
import { FootNoteComponent } from './foot-note.component';

describe('FootNoteComponent', () => {
  let component: FootNoteComponent;
  let fixture: ComponentFixture<FootNoteComponent>;

  beforeEach(() => {
    const footNoteServiceStub = () => ({
      getFootNote: (moduleId, companyId) => ({ subscribe: f => f({}) }),
      addFootNote: model => ({ subscribe: f => f({}) }),
      updateFootNote: model => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [FootNoteComponent],
      providers: [{ provide: FootNoteService, useFactory: footNoteServiceStub }]
    });
    fixture = TestBed.createComponent(FootNoteComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`moduleId has default value`, () => {
    expect(component.moduleId).toEqual(0);
  });

  it(`companyId has default value`, () => {
    expect(component.companyId).toEqual(0);
  });

  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
      const simpleChangesStub: SimpleChanges = <any>{};
      spyOn(component, 'getNote').and.callThrough();
      component.ngOnChanges(simpleChangesStub);
      expect(component.getNote).toHaveBeenCalled();
    });
  });

  describe('saveNote', () => {
    it('makes expected calls', () => {
      spyOn(component, 'checkFootnote').and.callThrough();
      spyOn(component, 'addFootNote').and.callThrough();
      spyOn(component, 'updateFootNote').and.callThrough();
      component.saveNote();
      expect(component.checkFootnote).toHaveBeenCalled();
      expect(component.addFootNote).toHaveBeenCalled();
      expect(component.updateFootNote).toHaveBeenCalled();
    });
  });

  describe('getNote', () => {
    it('makes expected calls', () => {
      const footNoteServiceStub: FootNoteService = fixture.debugElement.injector.get(
        FootNoteService
      );
      spyOn(footNoteServiceStub, 'getFootNote').and.callThrough();
      component.getNote();
      expect(footNoteServiceStub.getFootNote).toHaveBeenCalled();
    });
  });

  describe('addFootNote', () => {
    it('makes expected calls', () => {
      const footNoteServiceStub: FootNoteService = fixture.debugElement.injector.get(
        FootNoteService
      );
      spyOn(component, 'getNote').and.callThrough();
      spyOn(footNoteServiceStub, 'addFootNote').and.callThrough();
      component.addFootNote();
      expect(component.getNote).toHaveBeenCalled();
      expect(footNoteServiceStub.addFootNote).toHaveBeenCalled();
    });
  });

  describe('updateFootNote', () => {
    it('makes expected calls', () => {
      const footNoteServiceStub: FootNoteService = fixture.debugElement.injector.get(
        FootNoteService
      );
      spyOn(component, 'getNote').and.callThrough();
      spyOn(footNoteServiceStub, 'updateFootNote').and.callThrough();
      component.updateFootNote();
      expect(component.getNote).toHaveBeenCalled();
      expect(footNoteServiceStub.updateFootNote).toHaveBeenCalled();
    });
  });
});
