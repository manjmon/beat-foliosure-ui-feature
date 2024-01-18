import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EsgModelComponent } from './esg-model.component';
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import { EsgService } from "../../../services/esg.services";
import { FootNoteService } from 'src/app/services/foot-note.service';
import { ValuationModelService } from "src/app/services/valuation-model.service";
import { ValuationChangesGuard } from "../../Valuation-Model/shared/valuation-changes-guard";
import { ToastrService } from "ngx-toastr";
import { FormsModule } from "@angular/forms";
import { of } from 'rxjs';

describe('EsgModelComponent', () => {
  let component: EsgModelComponent;
  let fixture: ComponentFixture<EsgModelComponent>;
  let portfolioCompanyService: PortfolioCompanyService;
  let esgService: EsgService;
  let footNoteService: FootNoteService;
  let valuationModelService: ValuationModelService;
  let valuationChangesGuard: ValuationChangesGuard;
  let toastrService: ToastrService;

  beforeEach(() => {
    const portfolioCompanyServiceStub = {
      getPortfolioCompany: () => of([]),
      getPortfolioCompanyById: () => of({ body: { companyDetails: {} }, code: "OK" })
    };
    const esgServiceStub = {
      getEsgDashboardData: () => of({ hasData: true, data: [], moduleId: 1 }),
     setselectedSubpageData: () => of({ subPageId: 2, isActive: false })
    };
    const footNoteServiceStub = {
      getEsgFootNote: () => of(null),
      addOrUpdateEsgFootNote: () => of({})
    };
    const valuationModelServiceStub = {
      unsavedChanges$: of(true),
      setRedirectionStatus: () => { }
    };
    const valuationChangesGuardStub = {
      canDeactivate: () => Promise.resolve(true)
    };
    const toastrServiceStub = {
      success: () => { },
      error: () => { }
    };

    TestBed.configureTestingModule({
      declarations: [EsgModelComponent],
      imports: [FormsModule],
      providers: [
        { provide: PortfolioCompanyService, useValue: portfolioCompanyServiceStub },
        { provide: EsgService, useValue: esgServiceStub },
        { provide: FootNoteService, useValue: footNoteServiceStub },
        { provide: ValuationModelService, useValue: valuationModelServiceStub },
        { provide: ValuationChangesGuard, useValue: valuationChangesGuardStub },
        { provide: ToastrService, useValue: toastrServiceStub }
      ]
    });

    fixture = TestBed.createComponent(EsgModelComponent);
    component = fixture.componentInstance;
    portfolioCompanyService = TestBed.inject(PortfolioCompanyService);
    esgService = TestBed.inject(EsgService);
    footNoteService = TestBed.inject(FootNoteService);
    valuationModelService = TestBed.inject(ValuationModelService);
    toastrService = TestBed.inject(ToastrService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get companies on ngOnInit', () => {
    spyOn(portfolioCompanyService, 'getPortfolioCompany').and.callThrough();
    component.ngOnInit();
    expect(portfolioCompanyService.getPortfolioCompany).toHaveBeenCalled();
  });

  it('should get ESG company data on onApplyClick', () => {
    spyOn(esgService, 'getEsgDashboardData').and.callThrough();
    spyOn(component, 'getCompanyDetailByID').and.callThrough();
    component.selectedCompany = { encryptedPortfolioCompanyId: '123' };
    component.onApplyClick();
    expect(esgService.getEsgDashboardData).toHaveBeenCalledWith('123');
    expect(component.getCompanyDetailByID).toHaveBeenCalled();
  });

  it('should get ESG note on getEsgNote', () => {
    spyOn(footNoteService, 'getEsgFootNote').and.callThrough();
    component.moduleId = 1;
    component.selectedCompany = { encryptedPortfolioCompanyId: '123' };
    component.selectedSubpageData = { subPageId: 1 };
    component.getEsgNote();
    expect(footNoteService.getEsgFootNote).toHaveBeenCalledWith({ ModuleId: 1, EncryptedCompanyId: '123', SubPageId: 1 });
  });

  it('should add or update ESG footnote on addOrUpdateEsgFootNote', () => {
    spyOn(footNoteService, 'addOrUpdateEsgFootNote').and.callThrough();
    spyOn(valuationModelService, 'setRedirectionStatus').and.callThrough();
    spyOn(component, 'getEsgNote').and.callThrough();
    spyOn(toastrService, 'success').and.callThrough();
    component.moduleId = 1;
    component.selectedCompany = { encryptedPortfolioCompanyId: '123' };
    component.selectedSubpageData = { subPageId: 1 };
    component.footNoteModel = { footNoteId: 1 };
    component.esgFootnoteText = 'Footnote';
    component.addOrUpdateEsgFootNote();
    expect(footNoteService.addOrUpdateEsgFootNote).toHaveBeenCalledWith({
      FootNoteId: 1,
      FootNote: 'Footnote',
      ModuleId: 1,
      EncryptedCompanyId: '123',
      SubPageId: 1
    });
    expect(valuationModelService.setRedirectionStatus).toHaveBeenCalled();
    expect(component.getEsgNote).toHaveBeenCalled();
    expect(component.disableCancel).toBe(true);
    expect(component.disableSave).toBe(true);
    expect(toastrService.success).toHaveBeenCalled();
  });

  it('should check footnote on checkFootnote', () => {
    component.footNoteModel = { footNote: 'Footnote' };
    component.esgFootnoteText = 'Footnote';
    const result = component.checkFootnote();
    expect(result).toBe(false);
  });

  it('should enable cancel and save buttons on onEditorValueChangeEvent', () => {
    spyOn(valuationModelService, 'setRedirectionStatus').and.callThrough();
    component.onEditorValueChangeEvent('Footnote');
    expect(valuationModelService.setRedirectionStatus).toHaveBeenCalledWith(false);
    expect(component.disableCancel).toBe(false);
    expect(component.disableSave).toBe(false);
  });
});