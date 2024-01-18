import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { PageConfigurationService } from 'src/app/services/page-configuration.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { PageSettingsComponent } from './page-settings.component';

describe('PageSettingsComponent', () => {
  let component: PageSettingsComponent;
  let fixture: ComponentFixture<PageSettingsComponent>;

  beforeEach(() => {
    const routerStub = () => ({});
    const pageConfigurationServiceStub = () => ({
      getTrackrecordDataTypes: () => ({ subscribe: f => f({}) }),
      getPageConfiguration: () => ({ subscribe: f => f({}) })
    });
    const formBuilderStub = () => ({});
    const toastrServiceStub = () => ({});
    const ngbModalStub = () => ({});
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PageSettingsComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        {
          provide: PageConfigurationService,
          useFactory: pageConfigurationServiceStub
        },
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: NgbModal, useFactory: ngbModalStub }
      ]
    });
    fixture = TestBed.createComponent(PageSettingsComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`pageList has default value`, () => {
    expect(component.pageList).toEqual([]);
  });

  it(`subPageList has default value`, () => {
    expect(component.subPageList).toEqual([]);
  });

  it(`subPageListClone has default value`, () => {
    expect(component.subPageListClone).toEqual([]);
  });

  it(`pageDropdownOptions has default value`, () => {
    expect(component.pageDropdownOptions).toEqual([]);
  });

  it(`isAddFieldButtonClicked has default value`, () => {
    expect(component.isAddFieldButtonClicked).toEqual(false);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`existingTags has default value`, () => {
    expect(component.existingTags).toEqual([]);
  });

  it(`isPopup has default value`, () => {
    expect(component.isPopup).toEqual(false);
  });

  it(`modalTitle has default value`, () => {
    expect(component.modalTitle).toEqual(`Confirmation`);
  });

  it(`isSaveChagesOldCount has default value`, () => {
    expect(component.isSaveChagesOldCount).toEqual(0);
  });

  it(`isDisabledBtn has default value`, () => {
    expect(component.isDisabledBtn).toEqual(true);
  });

  it(`trackrecordDataTypes has default value`, () => {
    expect(component.trackrecordDataTypes).toEqual([]);
  });

  it(`pageConfigurationsDatalist has default value`, () => {
    expect(component.pageConfigurationsDatalist).toEqual([]);
  });

  it(`disablePageList has default value`, () => {
    expect(component.disablePageList).toEqual(false);
  });

  it(`status has default value`, () => {
    expect(component.status).toEqual(false);
  });

  it(`isexits has default value`, () => {
    expect(component.isexits).toEqual(0);
  });
  describe('drop', () => {
    it('makes expected calls', () => {
      const cdkDragDropStub: CdkDragDrop<any> = <any>{};
      spyOn(component, 'checkAnyDataChange').and.callThrough();
      component.drop(cdkDragDropStub);
      expect(component.checkAnyDataChange).toHaveBeenCalled();
    });
  });
  

});
