import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { PopularTagsComponent } from './popular-tags.component';
import { of } from 'rxjs';

describe('PopularTagsComponent', () => {
  let component: PopularTagsComponent;
  let fixture: ComponentFixture<PopularTagsComponent>;

  beforeEach(() => {
    const documentServiceStub = () => ({
      getPopularTags: foldername => ({ subscribe: f => of({}) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PopularTagsComponent],
      providers: [{ provide: DocumentService, useFactory: documentServiceStub }]
    });
    fixture = TestBed.createComponent(PopularTagsComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`tags has default value`, () => {
    expect(component.tags).toEqual([]);
  });

  it(`foldername has default value`, () => {
    expect(component.foldername).toEqual(`Shared folder`);
  });

  it(`loader has default value`, () => {
    expect(component.loader).toEqual(false);
  });

  it(`updatePopularTags has default value`, () => {
    expect(component.updatePopularTags).toEqual(false);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getPopularTags').and.callThrough();
      component.ngOnInit();
      expect(component.getPopularTags).toHaveBeenCalled();
    });
  });

  describe('ngDoCheck', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getPopularTags').and.callThrough();
      component.ngDoCheck();
      expect(component.getPopularTags).toHaveBeenCalled();
    });
  });

  describe('getPopularTags', () => {
    it('makes expected calls', () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(documentServiceStub, 'getPopularTags').and.callThrough();
      component.getPopularTags();
      expect(documentServiceStub.getPopularTags).toHaveBeenCalled();
    });
  });
});
