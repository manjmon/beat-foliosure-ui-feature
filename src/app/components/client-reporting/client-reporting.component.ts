import { Component, HostListener, OnInit } from '@angular/core';
import { ITab } from 'projects/ng-neptune/src/lib/Tab/tab.model';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { ClientReportingService } from 'src/app/services/client-reporting.service';
import { dynamicSort, getListQuarters } from 'src/app/utils/utils';
import { AdhocDataScroll, AdhocDownload, CalendarQuarterYearModel } from './client-reporting-model';
import { AdhocPeriodType, MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-client-reporting",
  templateUrl: "./client-reporting.component.html",
  styleUrls: ["./client-reporting.component.scss"],
})
export class ClientReportingComponent implements OnInit {
  selectedCompany: any = {};
  companyList: any[] = [];
  tabList: any[] = [];
  tabName: string = null;
  exportLoading: boolean = false;
  globalFilter: any;
  cols: any[];
  reportingList: any[] = [];
  colHeaders: any[] = [];
  customWidth: any = '301px';
  frozenTableColumns: any[] = [];
  tableColumns: any[] = [];
  clientReportData: any[] = [];
  isLoader = false;
  periodTypeList = [];
  adhocDownload: AdhocDownload;
  selectedPeriodType: any = { label: null, value: null, keyValue: null };
  guid: string;
  calendar_Quarter_YearModel: CalendarQuarterYearModel;
  yearRange: any;
  yearOptions = [];
  selectedYear: any = {};
  selectedToYear: any = {};
  selectedQuarter: any = null;
  selectedMonth: any = null;
  selectedToMonth: any = null;
  sideNavBaseClass: any = "";
  periodLastestEntities = [];
  latestSelectedPeriod: any;
  adhocDataScroll: AdhocDataScroll[] = [];
  defaultSelectedTab: string = null;
  isMonthYearValidation: boolean = false;
  isFromMonthYearValidation: boolean = false;
  windowHeight=0;
  constructor(private portfolioCompanyService: PortfolioCompanyService,private toastrService: ToastrService, private clientReportingService: ClientReportingService, private miscService: MiscellaneousService) {
    this.adhocDownload = <AdhocDownload>{
      PortfolioCompanyId: 0,
      Guid: ''
    };
    this.calendar_Quarter_YearModel = <CalendarQuarterYearModel>{
      Year: 0,
      Month: 0,
      Quarter: null
    }
    this.yearOptions = this.miscService.bindYearList();
    this.yearRange = "2000:" + (Number(new Date().getFullYear())+50).toString();
  }


  ngOnInit(): void {
    this.getCompanies();
  }
  ngAfterViewInit() {
    this.windowHeight = window.innerHeight - 255;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowHeight = window.innerHeight - 255;
  }
  getSideNavWidth() {
    this.sideNavBaseClass = this.miscService.getSideBarWidth() == "17.3em" ? "pt-p select-pr-expand" : "";
  }
  onResized($event) {
    this.getSideNavWidth();
  }
  getCompanies() {
    this.portfolioCompanyService.getPortfolioCompany().subscribe({
      next:
      (result:any) => {
        if (result != null && result.length > 0) {
          this.companyList = result || [];
          this.companyList = this.companyList.sort(dynamicSort("companyName"));
          this.selectedCompany = this.companyList[0];
          this.adhocDownload.PortfolioCompanyId = this.selectedCompany.portfolioCompanyID;
          this.getPeriodTypesAndLatestData();
        }
      },
      error: (error) => { }
  });
  }
  changePeriod(event) {
    this.selectedQuarter = null;
    this.selectedYear = { text: null, value: null };
    this.selectedMonth = null;
    this.adhocDownload.PeriodType = this.selectedPeriodType.label;
    if (this.selectedPeriodType.label == AdhocPeriodType.Annual && this.periodLastestEntities.find(o => o.periodType === AdhocPeriodType.Annual) != undefined) {
      this.selectedYear = { text: this.periodLastestEntities.find(o => o.periodType === AdhocPeriodType.Annual).year.toString(), value: this.periodLastestEntities.find(o => o.periodType === AdhocPeriodType.Annual).year.toString() }
      this.onSelectMonth(null);
    }
    if (this.selectedPeriodType.label == AdhocPeriodType.Monthly && this.periodLastestEntities.find(o => o.periodType === AdhocPeriodType.Monthly) != undefined) {
      this.selectedMonth=null;
      this.selectedToMonth=null;
      let month = this.periodLastestEntities.find(o => o.periodType === AdhocPeriodType.Monthly).month;
      let year = this.periodLastestEntities.find(o => o.periodType === AdhocPeriodType.Monthly).year;
      this.selectedMonth = new Date((year || 0), (month < 10 ? "0" + month : month || 0), 1);
      this.selectedMonth.setMonth(this.selectedMonth.getMonth() - 1);
      this.selectedToMonth = this.selectedToMonth == null ? this.selectedMonth : this.selectedToMonth;
      this.onSelectMonth(null);
    }
    if (this.selectedPeriodType.label == AdhocPeriodType.Quarterly && this.periodLastestEntities.find(o => o.periodType === AdhocPeriodType.Quarterly) != undefined) {
      this.selectedQuarter = (this.periodLastestEntities.find(o => o.periodType === AdhocPeriodType.Quarterly).quarter || null) + ' ' + (this.periodLastestEntities.find(o => o.periodType === AdhocPeriodType.Quarterly).year || 0);
      this.onSelectMonth(null);
    }
  }
  onSelectMonth(event) {
    this.changeEventControlTrigger();
    this.clearTableData();
    this.isMonthYearValidation = false;
    if (this.selectedPeriodType.label == AdhocPeriodType.Monthly) {
      this.checkTwoDates();
    }
    if (!this.isMonthYearValidation)
      this.getTabList();
    if (this.isMonthYearValidation)
      this.clearTabs();
  }
  onSelectToMonth() {
    this.changeEventControlTrigger();
    this.clearTableData();
    this.isMonthYearValidation = false;
    if (this.selectedPeriodType.label == AdhocPeriodType.Monthly) {
      this.checkTwoDates();
    }
    if (!this.isMonthYearValidation)
      this.getTabList();
    if (this.isMonthYearValidation)
      this.clearTabs();
  }
  fromQuarterYear(event: any) {
    this.selectedQuarter = event.quarter + ' ' + event.year;
    this.changeEventControlTrigger();
    this.clearTableData();
    this.getTabList();
  }
  yearOptionsChange(event) {
    this.changeEventControlTrigger();
    this.clearTableData();
    this.getTabList();
  }
  clearTableData() {
    this.clientReportData = [];
    this.colHeaders = [];
    this.reportingList = [];
    this.tableColumns = [];
    this.frozenTableColumns = [];
  }
  clearTabs(){
    this.tabList=[];
  }
  getPeriodTypesAndLatestData() {
    this.clientReportingService.getPeriodTypes(this.selectedCompany.portfolioCompanyID).subscribe((result: any) => {
      this.periodLastestEntities = result?.periodsLatestEntities || [];
      this.latestSelectedPeriod = this.periodLastestEntities[0];
      this.periodTypeList = result?.periodTypes || [];
      this.adhocDataScroll=[];
      if (this.periodTypeList.find((obj) => obj.label === this.latestSelectedPeriod?.periodType || null) != undefined)
        this.selectedPeriodType = this.periodTypeList.find((obj) => obj.label === this.latestSelectedPeriod?.periodType || null);
      else
        this.selectedPeriodType = { label: null, value: null, keyValue: null };

      if (this.latestSelectedPeriod?.periodType == AdhocPeriodType.Annual) {
        if (this.yearOptions.find((obj) => +obj.value === this.latestSelectedPeriod?.year || 0) != undefined)
          this.selectedYear = this.yearOptions.find((obj) => +obj.value === this.latestSelectedPeriod?.year || 0)
        else
          this.selectedYear = { text: null, value: null };
      }
      if (this.latestSelectedPeriod?.periodType == AdhocPeriodType.Quarterly) {
        this.selectedQuarter = (this.latestSelectedPeriod?.quarter || null) + ' ' + (this.latestSelectedPeriod?.year || 0);
      }
      if (this.latestSelectedPeriod?.periodType == AdhocPeriodType.Monthly) {
        this.selectedToMonth=null;
        this.selectedMonth = new Date((this.latestSelectedPeriod?.year || 0), (this.latestSelectedPeriod?.month < 10 ? "0" + this.latestSelectedPeriod?.month : this.latestSelectedPeriod?.month || 0), 1);
        this.selectedMonth.setMonth(this.selectedMonth.getMonth() - 1);
        this.selectedToMonth = this.selectedToMonth == null ? this.selectedMonth : this.selectedToMonth;
      }     
      this.changeEventControlTrigger();
      this.getTabList();
    });
  }
  getMonthScrollLoad() {
    let date = this.selectedMonth.toLocaleString('default', { month: 'short', year: 'numeric' });
    const end_date = new Date(date.replace(" ", " ,1 "));
    const start_date = new Date(this.selectedToMonth.getFullYear(), this.selectedToMonth.getMonth(), 1);
    this.adhocDataScroll = [];
    while (end_date <= start_date) {
      let adhocScroll = <AdhocDataScroll>{};
      adhocScroll.Month = start_date.getMonth() + 1;
      adhocScroll.MonthYear = start_date.toLocaleString('default', { month: 'short', year: 'numeric' });
      adhocScroll.Year = start_date.getFullYear();
      adhocScroll.PeriodType = this.selectedPeriodType.label;
      this.adhocDataScroll.push(adhocScroll);
      start_date.setMonth(start_date.getMonth() - 1);
    }
    this.adhocDataScroll.sort(function (a, b) {
      const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      if (a.Year !== b.Year) {
        return a.Year - b.Year;
      } else {
        return months.indexOf(a.Month) - months.indexOf(b.Month);
      };
    });
    this.defaultSelectedTab = this.adhocDataScroll.length > 0 ? this.adhocDataScroll[0].MonthYear : null;
  }
  getYearScrollLoad() {
    let currentYear = 2022;
    let startYear = 2020;
    this.adhocDataScroll=[];
    for (let i = startYear; i <= currentYear; i++) {
      let adhocScroll = <AdhocDataScroll>{};
      adhocScroll.Month=null;
      adhocScroll.QuarterNo=null;
      adhocScroll.Year = startYear++;
      this.adhocDataScroll.push(adhocScroll);
    }
    this.defaultSelectedTab = this.adhocDataScroll.length > 0 ? this.adhocDataScroll[0].Year.toString() : null;
  }
  getQuarterScrollLoad() {
    let startQuarterDate = this.miscService.getQuarterLastDateByQuarter("Q1", 2020);
    let endQuarterDate = this.miscService.getQuarterLastDateByQuarter("Q1", 2022);
    this.adhocDataScroll=[];
    getListQuarters(startQuarterDate, endQuarterDate)?.forEach(x=>{
      let adhocScroll = <AdhocDataScroll>{};
      adhocScroll.Month=null;
      adhocScroll.QuarterNo=null;
      adhocScroll.Quarter=x;
      this.adhocDataScroll.push(adhocScroll);
    });
    this.defaultSelectedTab = this.adhocDataScroll.length > 0 ? this.adhocDataScroll[0].Quarter.toString() : null;
  }
  getTabList() {
    this.isLoader = true;
    this.tabList = [];
    const selectedPeriodTypeCopy = this.selectedPeriodType;
    this.clientReportingService.getTabs(this.adhocDownload).subscribe({
      next: (result: any) => {
        this.tabList = [];
        result.forEach((x, i) => {
          this.tabList.push({ name: x.sheetName, active: i == 0 ? true : false, moduleId: x.s3, aliasname: x.sheetName });
        });
        this.isLoader = true;
        if (this.selectedPeriodType == null) {
          this.selectedPeriodType = selectedPeriodTypeCopy;
        }
        if (this.tabList.length > 0) {
          this.clearTableData();
          this.guid = this.tabList[0].moduleId;
          this.getAdhocReportData(this.tabList[0].moduleId);
        }
        else {
          this.clearTableData();
          this.isLoader = false;
        }
      }, error: error => {
        this.isLoader = false;
      }
    });
  }
  selectTab(tab: ITab) {
    this.isExportLoading = false;
    this.isFullExportLoading = false;
    this.tabList.forEach(tab => tab.active = false);
    tab.active = true;
    this.isLoader = true;
    this.clientReportData = [];
    this.colHeaders = [];
    this.reportingList = [];
    this.tableColumns = [];
    this.frozenTableColumns = [];
    this.guid = tab.moduleId.toString();
    this.getAdhocReportData(tab.moduleId);
  }
  parsedText(text) {
    const dom = new DOMParser().parseFromString(
      '<!doctype html><body>' + text,
      'text/html'
    );
    const decodedString = dom.body.textContent;
    return decodedString;
  }
  wrapperToSafeHtml(value) {
    return toSafeHtml(value);
  }
  companyChangeEvent() {
    this.clientReportData = [];
    this.colHeaders = [];
    this.reportingList = [];
    this.tableColumns = [];
    this.frozenTableColumns = [];
    this.getPeriodTypesAndLatestData();
  }
  getAdhocReportData(guId: any) {
    this.clientReportingService.getUnstructerDataByPortfolioCompanyId(this.selectedCompany.portfolioCompanyID, guId).subscribe({
      next: (result: any) => {
        this.clientReportData = [];
        this.colHeaders = [];
        this.reportingList = [];
        this.tableColumns = [];
        this.frozenTableColumns = [];
        this.clientReportData = result;
        this.colHeaders = this.clientReportData[0]?.headers || [];
        if (this.colHeaders.length > 0) {
          this.colHeaders[0]["isFrozenColumn"] = true;
          this.frozenTableColumns.push(this.colHeaders[0]);
        }
        let tableArray = this.colHeaders;
        tableArray.shift();
        this.tableColumns = tableArray;
        this.reportingList = this.clientReportData[0]?.rows || [];
        this.isLoader = false;
      }, error: (error) => {
        this.isLoader = false;
      }
    });
  }
  isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }
  adhocSearch() {
    if (!this.isEmptyOrSpaces(this.globalFilter)) {
      if (!this.clientReportData[0]?.rows.length) {
        this.reportingList = [];
        return;
      }
      if (!this.globalFilter) {
        this.reportingList = [...this.clientReportData[0]?.rows];
        return;
      }
      const users = [...this.clientReportData[0]?.rows];
      const properties = Object.keys(users[0]);
      this.reportingList = users.filter((user) => {
        return properties.find((property) => {
          const valueString = user[property].toString().trim().toLowerCase();
          return valueString.includes(this.globalFilter.trim().toLowerCase());
        })
          ? user
          : null;
      });
    }
    else {
      this.reportingList = [...this.clientReportData[0]?.rows];
    }
  }
  isExportLoading = false;
  exportReport() {
    this.isExportLoading = false;
    this.adhocDownload.PortfolioCompanyId = this.selectedCompany.portfolioCompanyID;
    this.adhocDownload.Guid = this.guid;
  }
  isFullExportLoading = false;
  exportFullReport() {
    this.isFullExportLoading = true;
    this.adhocDownload.PortfolioCompanyId = this.selectedCompany.portfolioCompanyID;
    this.adhocDownload.Guid = this.selectedCompany?.companyName;
    if (this.selectedPeriodType.label == AdhocPeriodType.Monthly) {
      this.isFullExportLoading = true;
      this.adhocDownload.AdhocDataScroll = this.adhocDataScroll;
      this.clientReportingService.exportReports(this.adhocDownload).subscribe({
        next: (response: any) => {
          this.miscService.downloadZIPFile(response);
          this.isFullExportLoading = false;
        },
        error: (error) => {
          this.isFullExportLoading = false;
          this.toastrService.error("No Data Found", "", { positionClass: "toast-center-center" });
        }
      })
    } else {
      this.changeEventControlTrigger();
      this.clientReportingService.exportReports(this.adhocDownload).subscribe(response => {
        this.miscService.downloadExcelFile(response);
        this.isFullExportLoading = false;
      });
    }
  }
  changeEventControlTrigger() {
    this.adhocDownload.PortfolioCompanyId = this.selectedCompany.portfolioCompanyID;
    this.adhocDownload.PeriodType = this.selectedPeriodType.label;
    this.adhocDownload.Year = 0;
    this.adhocDownload.Month = 0;
    this.adhocDownload.Quarter = null;
    if (this.selectedPeriodType.label == AdhocPeriodType.Monthly) {
      this.adhocDownload.Year = this.selectedMonth == null ? 0 : new Date(Date.parse(this.selectedMonth)).getFullYear();
      this.adhocDownload.Month = this.selectedMonth == null ? 0 : new Date(Date.parse(this.selectedMonth)).getMonth() + 1;
      this.getMonthScrollLoad();
    }
    if (this.selectedPeriodType.label == AdhocPeriodType.Annual) {
      this.adhocDownload.Year = Object.values(this.selectedYear).length == 0 ? 0 : +this.selectedYear.value;
    }
    if (this.selectedPeriodType.label == AdhocPeriodType.Quarterly) {
      this.adhocDownload.Year = this.selectedQuarter?.split(' ')[1];
      this.adhocDownload.Quarter = this.selectedQuarter?.split(' ')[0];
    }
  }
  onClickActiveTab(event: any) {
    this.adhocDownload.PortfolioCompanyId = this.selectedCompany.portfolioCompanyID;
    this.adhocDownload.PeriodType = this.selectedPeriodType.label;
    this.adhocDownload.Year = 0;
    this.adhocDownload.Month = 0;
    this.adhocDownload.Quarter = null;
    if (this.selectedPeriodType.label == AdhocPeriodType.Monthly) {
      this.adhocDownload.Year = event.Year;
      this.adhocDownload.Month = event.Month;
    }
    this.clearTableData();
    this.getTabList();
  }
  checkTwoDates() {
    this.isMonthYearValidation = false;
    if (this.selectedMonth?.getTime() > this.selectedToMonth?.getTime()) {
      this.isMonthYearValidation = true;
    }
  }
}
export function toSafeHtml(value): any {
  return new DOMParser().parseFromString(value, "text/html").documentElement.textContent;
}