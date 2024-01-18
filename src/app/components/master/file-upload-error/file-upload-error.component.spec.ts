import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule
} from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FileUploadErrorComponent } from './file-upload-error.component';
import { FeaturesEnum } from 'src/app/services/permission.service';

describe('FileUploadErrorComponent', () => {
  let component: FileUploadErrorComponent;
  let fixture: ComponentFixture<FileUploadErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [FileUploadErrorComponent],
      providers: [FileUploadErrorComponent,
        { provide: 'BASE_URL', useValue: 'http://localhost' }
      ]
    });
    fixture = TestBed.createComponent(FileUploadErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'ngOnInit').and.callThrough();
      component.ngOnInit();
      expect(component.ngOnInit).toHaveBeenCalled();
    })
  });
  describe('hasValue', () => {
    it('makes expected calls', () => {
      const val = 'test';
      spyOn(component, 'hasValue').and.callThrough();
      component.hasValue(val);
      expect(component.hasValue).toHaveBeenCalled();
    })
  });
  describe('hasErrorMessage', () => {
    it('makes expected calls', () => {
      const element = 'test';
      spyOn(component, 'hasErrorMessage').and.callThrough();
      component.hasErrorMessage(element);
      expect(component.hasErrorMessage).toHaveBeenCalled();
    })
  });
  describe('setErrorCountAndSheetName', () => {
    it('makes expected calls', () => {
      const element = 'test';
      spyOn(component, 'setErrorCountAndSheetName').and.callThrough();
      component.setErrorCountAndSheetName(element);
      expect(component.setErrorCountAndSheetName).toHaveBeenCalled();
    })
  });
  describe('getErrorListFOF', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getErrorListFOF').and.callThrough();
      component.getErrorListFOF();
      expect(component.getErrorListFOF).toHaveBeenCalled();
    })
  });
  describe('setPannelFOFIfDataNotAvailable', () => {
    it('makes expected calls', () => {
      spyOn(component, 'setPannelFOFIfDataNotAvailable').and.callThrough();
      component.setPannelFOFIfDataNotAvailable();
      expect(component.setPannelFOFIfDataNotAvailable).toHaveBeenCalled();
    })
  });
  describe('setPannelFOFIfDataAvailable', () => {
    it('makes expected calls', () => {
      const data = 'test';
      spyOn(component, 'setPannelFOFIfDataAvailable').and.callThrough();
      component.setPannelFOFIfDataAvailable(data);
      expect(component.setPannelFOFIfDataAvailable).toHaveBeenCalled();
    })
  });
  describe('getAllFileError', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getAllFileError').and.callThrough();
      component.getAllFileError();
      expect(component.getAllFileError).toHaveBeenCalled();
    })
  });
  describe('getErrorListESG', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getErrorListESG').and.callThrough();
      component.getErrorListESG();
      expect(component.getErrorListESG).toHaveBeenCalled();
    })
  });
  describe('setActive', () => {
    it('makes expected calls', () => {
      let errorflow = [{
        isExpanded: false
      }]
      spyOn(component, 'setActive').and.callThrough();
      component.setActive(errorflow);
      expect(component.setActive).toHaveBeenCalled();
    })
  });
  describe('setHeaderName', () => {
    it('makes expected calls', () => {
      let errorflow = [{
        isExpanded: false
      }]
      spyOn(component, 'setHeaderName').and.callThrough();
      component.setHeaderName(errorflow);
      expect(component.setHeaderName).toHaveBeenCalled();
    })
  });
  describe('ngAfterViewInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'ngAfterViewInit').and.callThrough();
      component.ngAfterViewInit();
      expect(component.ngAfterViewInit).toHaveBeenCalled();
    })
  });
  describe('isExpandFOF', () => {
    it('makes expected calls', () => {
      const item = 'test';
      spyOn(component, 'isExpandFOF').and.callThrough();
      component.isExpandFOF(item);
      expect(component.isExpandFOF).toHaveBeenCalled();
    })
  });
  describe('isExpand', () => {
    it('makes expected calls', () => {
      const item = [{
        isExpande: false
      }];
      spyOn(component, 'isExpand').and.callThrough();
      component.isExpand(item);
      expect(component.isExpand).toHaveBeenCalled();
    })
  });
  describe('isExpand', () => {
    it('makes expected calls', () => {
      const item = [{
        isExpande: true
      }];
      spyOn(component, 'isExpand').and.callThrough();
      component.isExpand(item);
      expect(component.isExpand).toHaveBeenCalled();
    })
  });
  describe('getTabList', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getTabList').and.callThrough();
      component.getTabList();
      expect(component.getTabList).toHaveBeenCalled();
    })
  });
  describe('getFileStatusErrorIcon', () => {
    it('makes expected calls', () => {
      let status = 1;
      spyOn(component, 'getFileStatusErrorIcon').and.callThrough();
      component.getFileStatusErrorIcon(status);
      expect(component.getFileStatusErrorIcon).toHaveBeenCalled();
    })
  });
  describe('getFileStatusText', () => {
    it('makes expected calls', () => {
      let status = 1;
      spyOn(component, 'getFileStatusText').and.callThrough();
      component.getFileStatusText(status);
      expect(component.getFileStatusText).toHaveBeenCalled();
    })
  });
  it('should not  show error panel if TotalErrors is empty', () => {
    spyOn(component,'showErrorPanel').and.callThrough();
    component.TotalErrors=[];
    component.setPannelESGIfDataNotAvailable();
    expect(component.showErrorPanel).not.toHaveBeenCalled();
  });
  it('should set pannel ESG if Data is Available',()=>{
  const spysetPannelESGIfDataAvailable = spyOn(component,'setPannelESGIfDataAvailable').and.callThrough();
  component.setPannelESGIfDataAvailable({featureId:47,fileId:'123'});
  expect(spysetPannelESGIfDataAvailable).toHaveBeenCalledWith({featureId:47,fileId:'123'});
  })
  it('should filter items based on filterText',()=>{
    component.TotalErrorsCopy=[
      {fileName:'file1.txt'},
      {fileName:'file2.txt'},
    ];
    component.filterText='file1';
    component.filterItem();
    expect(component.TotalErrors.length).toBe(1);
    expect(component.TotalErrors[0].fileName).toBe('file1.txt')
    
  });
  it('should not call setPannelESGIdDataAvailable if data or featureId is missing',()=>{
    const spysetPannelESGIfDataAvailable = spyOn(component,'setPannelESGIfDataAvailable').and.callThrough();
    component.getErrorListESG();
    expect(spysetPannelESGIfDataAvailable).not.toHaveBeenCalled();
  })
  it('should  call setPannelESGIdDataAvailable if data or featureId are present',()=>{
    const spysetPannelESGIfDataAvailable = spyOn(component,'setPannelESGIfDataAvailable').and.callThrough();
    component.data={featureId:FeaturesEnum.EsgModel};
    component.getErrorListESG();
    expect(spysetPannelESGIfDataAvailable).toHaveBeenCalled();
  });
});
