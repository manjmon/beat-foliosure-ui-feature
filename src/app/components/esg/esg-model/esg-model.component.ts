
import { Component, OnInit } from "@angular/core";
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import { EsgService } from "../../../services/esg.services";
import { PeriodTypeFilterOptions, PeriodType } from "src/app/common/constants";
import { FootNoteService } from 'src/app/services/foot-note.service';
import { isNull, isUndefined } from "mathjs";
import { ValuationModelService } from "src/app/services/valuation-model.service";
import { ValuationComponentCanDeactivate } from "src/app/unsaved-changes/can-deactivate/component-can-deactivate";
import { ValuationChangesGuard } from "../../Valuation-Model/shared/valuation-changes-guard";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-esg-model',
  templateUrl: './esg-model.component.html',
  styleUrls: ['./esg-model.component.scss'],
  providers: [ValuationChangesGuard]
})
export class EsgModelComponent extends ValuationComponentCanDeactivate implements OnInit {
  companyList: any[];
  selectedCompany: any;
  prevSelectedCompany: any;
  selectedCompanyDetails: any;
  disableApply: boolean = true;
  showDivison = false;
  showPeriod: boolean = false;
  esgSubPageData: any;
  isQuarterly: boolean = false;
  isAnnually: boolean = false;
  selectedSubpageData: any;
  filterOptions = PeriodType.filterOptions;
  esgSubPageTabList: any;
  defaultType: string = "Quarterly";
  moduleId: number;
  esgFootnoteText: any = "";
  editorPlaceholder: string = 'Enter Footnotes here...';
  footNoteModel: any = null;
  disableCancel: boolean = true;
  disableSave: boolean = true;
  canDeactivateStatus: boolean = true;
  subscriptions: any = [];
  currentModelRef: any;
  showFootNote: boolean = false;

  constructor(private _portfolioCompanyService: PortfolioCompanyService, private _esgService: EsgService, private _footNoteService: FootNoteService,
    private _valuationModelService: ValuationModelService, private _valuationChangesGuard: ValuationChangesGuard, private toastrService: ToastrService) {
    super();
    this.subscriptions.push(this._valuationModelService.unsavedChanges$.subscribe((status: boolean) => {
      this.canDeactivateStatus = status
    }));
  }

  canDeactivate(): boolean {
    return this.canDeactivateStatus;
  }

  ngOnInit() {
    this.canDeactivateStatus = true;
    this.defaultTabSet();
    this.getCompanies();
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  defaultTabSet() {
    this.filterOptions.forEach((x) => (x.key = false));
    this.filterOptions = this.filterOptions.filter(x => x.field != PeriodTypeFilterOptions.Monthly);
    let objIndex = this.filterOptions.findIndex(x => x.field == PeriodTypeFilterOptions.Quarterly);
    this.filterOptions[objIndex].key = true;
  }
  getCompanies() {
    this._portfolioCompanyService.getPortfolioCompany().subscribe({
      next: (_res => {
        this.companyList = _res;
        this.disableApply = true;
      })
    });
  }

  onChangePeriodOption(type) {
    this.filterOptions.forEach((x) => (x.key = false));
    if (type.field == "Quarterly") {

      type.key = this.isQuarterly = true;
      this.isAnnually = false;
    } else {
      this.isQuarterly = false;
      type.key = this.isAnnually = true;
    }
    this.setDefaultTypeTab();
  }
  QuaterandAnnual(event) {
    this.onChangePeriodOption(event)
    this.setDefaultTypeTab();
    this.switchQuaterandAnnualTab();
  }

  switchQuaterandAnnualTab() {
    this.filterOptions.forEach((x) => (x.key = false));
    let objIndex = this.filterOptions.findIndex(x => x.field == this.defaultType);
    this.filterOptions[objIndex].key = true;
  }

  setDefaultTypeTab = () => {
    if (this.isQuarterly)
      this.defaultType = PeriodTypeFilterOptions.Quarterly;
    else
      this.defaultType = PeriodTypeFilterOptions.Annual;
  }
  onCompanySelection(prevState: any, currentState: any) {
    this._valuationChangesGuard.canDeactivate(this).then((status: boolean) => {
      if (status) {
        if (currentState != null) {
          this.disableApply = false;
        }
        this.selectedCompany = currentState;
        this.prevSelectedCompany = currentState;
        this.canDeactivateStatus = status;
        this.disableCancel = true;
        this.disableSave = true;
      }
      else {
        this.selectedCompany = this.prevSelectedCompany;
      }
    });
  }
  refreshEsgDataEventHandler(event: boolean) {
    if (event) {
      this.getEsgCompanyData();
    }
  }
  showFootNoteEventHandler(event: boolean) {
    this.showFootNote = event;
  }

  getCompanyDetailByID() {
    this._portfolioCompanyService
      .getPortfolioCompanyById({ Value: this.selectedCompany?.encryptedPortfolioCompanyId ?? "" })
      .subscribe({
        next: (result) => {
          let resp = result["body"];
          if (resp != null && result.code == "OK") {
            this.selectedCompanyDetails = resp?.companyDetails;
          }
        },
        error: (_error) => {

        }
      });
  }
  onApplyClick() {
    if (this.selectedCompany !== null && this.selectedCompany !== undefined) {
      this.getEsgCompanyData();
      this.getCompanyDetailByID();
    }
    this.disableApply = true;
  }
  getEsgCompanyData() {
    this._esgService.getEsgDashboardData(this.selectedCompany?.encryptedPortfolioCompanyId ?? "").subscribe({
      next: (_res => {
        if (_res.hasData) {
          this.esgSubPageData = _res.data;
          this.esgSubPageTabList = this.esgSubPageData?.map((item, index) => {
            const { esgSubFieldList, esgKpiList, ...rest } = item;
            if (index === 0) {
              rest.isActive = true;
            }
            else {
              rest.isActive = false;
            }
            return rest;
          });
          this.showDivison = true;
          this.selectedSubpageData = _res.data[0];
          this.moduleId = _res.moduleId;
          this.showPeriod = true;         
          if (!isNull(this.selectedCompany?.portfolioCompanyID) && !isUndefined(this.selectedCompany?.portfolioCompanyID)) {
            this.getEsgNote();
          }
        }
        else {
          this.showDivison = true;
          this.esgSubPageData = null;
          this.esgSubPageTabList = null;
          this.selectedSubpageData = [];
          this.showPeriod = false;
          this.showFootNote = false;
        }
        this._esgService.setselectedSubpageData(this.selectedSubpageData);
      })
    });
  }
  changeEsgSubPageTab(prevState: any, selectedSubPageTab: any) {
    this._valuationChangesGuard.canDeactivate(this).then((status: boolean) => {
      if (status) {
        this?.esgSubPageTabList?.forEach(row => {
          row.isActive = false;
          if (row.subPageId === selectedSubPageTab.subPageId) {
            row.isActive = true;
          }
        });
        selectedSubPageTab.isActive = true;
        this.selectedSubpageData = this.esgSubPageData.find(x => x.subPageId === selectedSubPageTab.subPageId);        
        this._esgService.setselectedSubpageData(this.selectedSubpageData);
        this.getEsgNote();
        this.canDeactivateStatus = status;
        this.disableCancel = true;
        this.disableSave = true;
      }
      else {
        this.selectedSubpageData = prevState;
      }
    });

  }
  QuaterlyAndAnnual() {
    const quaterData = this.selectedSubpageData?.esgKpiList[0]?.kpiData?.find(x => x.quarter !== null);
    const annualData = this.selectedSubpageData?.esgKpiList[0]?.kpiData?.find(x => x.quarter == null);
    if ((quaterData == undefined || quaterData?.kpiValue == "") && annualData?.kpiValue !== "") {
      this.defaultType = "Annual";
    }
    else {
      this.defaultType = "Quarterly"
    }
    this.onChangePeriodOption({ field: this.defaultType });
    this.setDefaultTypeTab();
    this.switchQuaterandAnnualTab();
  }
  truncateTabName(name: string, maxLength: number): any {
    name = name.trim();
    if (name.length <= maxLength) {
      return name;
    } else {
      const shortFilename = name.slice(0, maxLength); // Leave space for "...."
      return `${shortFilename}...`;
    }
  }

  onFootNoteCancel() {
    this._valuationChangesGuard.canDeactivate(this).then((status: boolean) => {
      if (status) {
        this.esgFootnoteText = this.footNoteModel?.footNote;
        this.disableCancel = true;
        this.disableSave = true;
      }
      this.canDeactivateStatus = status;
    });
  }

  onFootNoteSave() {
    if (this.checkFootnote()) {
      this.addOrUpdateEsgFootNote();
    }
  }

  getEsgNote() {
    let model = {
      ModuleId: this.moduleId,
      EncryptedCompanyId: this.selectedCompany?.encryptedPortfolioCompanyId,
      SubPageId: this.selectedSubpageData?.subPageId
    };
    this._footNoteService.getEsgFootNote(model).subscribe({
      next: (result: any) => {
        this.footNoteModel = result;
        if (result != null) {
          this.esgFootnoteText = result.footNote;
        }
        else {
          this.esgFootnoteText = '';
        }
      },
      error: (_error) => { }
    });
  }

  addOrUpdateEsgFootNote() {
    let model = {
      FootNoteId: this.footNoteModel?.footNoteId ?? 0,
      FootNote: this.esgFootnoteText,
      ModuleId: this.moduleId,
      EncryptedCompanyId: this.selectedCompany?.encryptedPortfolioCompanyId,
      SubPageId: this.selectedSubpageData?.subPageId
    };
    this._footNoteService.addOrUpdateEsgFootNote(model).subscribe({
      next: (result: any) => {
        this._valuationModelService.setRedirectionStatus(true);
        this.getEsgNote();
        this.disableCancel = true;
        this.disableSave = true;
        this.toastrService.success("Footnotes Saved Successfully", "", { positionClass: "toast-center-center" });
      },
      error: (_error) => {
        this.toastrService.error("Footnotes Failed To Save", "", { positionClass: "toast-center-center" });
      }
    });
  }

  checkFootnote() {
    return this.footNoteModel?.footNote?.trim() != this.esgFootnoteText?.trim();
  }

  onEditorValueChangeEvent(event: any) {
    if (event === this.footNoteModel?.footNote) {
      this._valuationModelService.setRedirectionStatus(true);
      this.disableCancel = true;
      this.disableSave = true;
    }
    else {
      this._valuationModelService.setRedirectionStatus(false);
      this.disableCancel = false;
      this.disableSave = false;
    }
  }
}
