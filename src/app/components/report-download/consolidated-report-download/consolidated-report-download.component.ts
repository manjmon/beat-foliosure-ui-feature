import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { ReportDownloadService } from 'src/app/services/report-download.service';

@Component({
  selector: 'app-consolidated-report-download',
  templateUrl: './consolidated-report-download.component.html',
  styleUrls: ['./consolidated-report-download.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConsolidatedReportDownloadComponent implements OnInit {
  isDownload: boolean = false;
  isEnable: boolean = true;
  isLoader: boolean = false;
  selectedTemplate: any = null;
  templateList: any = [];
  fromYearQuarter: any = null;
  toYearQuarter: any = null;
  isValidateQuarter:boolean=false;
  buttonToggle: boolean = true;
  isQuarters:boolean=false;
  constructor(private reportDownloadService: ReportDownloadService, private miscService: MiscellaneousService) { }

  ngOnInit(): void {
    this.getTemplates();
  }
  buttonClick(): void {
    this.buttonToggle = !this.buttonToggle;
  }
  getTemplates() {
    this.isLoader = true;
    this.reportDownloadService.getConsolidatedReportTemplates().subscribe(
      (result) => {
        this.isLoader = false;
        let zeroStateArray=[{"templateId":0,"templateName":"Select Report Template","isDefault":false,"isActive":false,"currencyUnit":0}]
        if (result != null && result.length > 0) {
          this.templateList.push(...zeroStateArray,...result);
          this.selectedTemplate=this.templateList[0];
        }
      },
      (error) => {
        this.isLoader = false;
      }
    );
  }
  download() {
    this.isDownload = true;
    let configuration = {
      TemplateId: this.selectedTemplate?.templateId,
      StartQuarter: this.fromYearQuarter,
      EndQuarter: this.toYearQuarter,
      PeriodType:this.isQuarters,
      TemplateName:this.selectedTemplate?.templateName,
      ExcelTemplateName:this.selectedTemplate?.excelTemplateName
    };
    this.reportDownloadService.downloadConsolidatedReport(configuration).subscribe(
      (response) => {
        this.isDownload = false;
        if (response != null) {
          this.miscService.downloadExcelFile(response);
        }
      },
      (error) => {
        this.isDownload = false;
      }
    );
  }
  templateChange(event) {
    this.isQuarters = event.value.isActive;
    this.buttonClick();   
    if (this.isQuarters) {
      this.isValidateQuarter = false;
      this.fromYearQuarter = null;
      this.toYearQuarter = null;
      this.validationForQuarter();
    } else
      this.isValidateQuarter = false;
  }
  validationForQuarter(){
    if (this.fromYearQuarter != null && this.toYearQuarter != null) {
      let startQuarterDate = this.miscService.getQuarterLastDateByQuarter(this.fromYearQuarter.split(' ')[0], this.fromYearQuarter.split(' ')[1]);
      let endQuarterDate = this.miscService.getQuarterLastDateByQuarter(this.toYearQuarter.split(' ')[0], this.toYearQuarter.split(' ')[1]);
      this.isValidateQuarter = false;
      if (startQuarterDate?.getTime() > endQuarterDate?.getTime()) {
        this.isValidateQuarter = true;
      }
    }
    if (this.fromYearQuarter == null && this.toYearQuarter == null){
      this.isValidateQuarter = true;
    }
  }
  FromQuarterYearFunction(event: any) {
    this.fromYearQuarter = event.quarter + ' ' + event.year;
    this.validationForQuarter();
  }
  ToQuarterYearFunction(event: any) {
    this.toYearQuarter = event.quarter + ' ' + event.year;
    this.validationForQuarter();
  }
}
