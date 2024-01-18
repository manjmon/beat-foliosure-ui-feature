import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { GetTemplatePeriodOptions } from 'src/app/common/constants';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { ReportDownloadService } from 'src/app/services/report-download.service';
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
@Component({
  selector: 'app-internal-report-download',
  templateUrl: './internal-report-download.component.html',
  styleUrls: ['./internal-report-download.component.scss']
})
export class InternalReportDownloadComponent implements OnInit {
  isCompanySheetToggle:boolean = false;
  isDownload:boolean = false;
  isEnable:boolean = true;
  isLoader:boolean = false;
  selectedTemplate:any =null;
  templateList:any=[];
  companyList:any=[];
  selectedPeriod = null;
  headers = [
    { field: "checkbox", header: "checkbox" },
    { header: "Company Name", field: "companyName" }
  ];
  @ViewChild('tblCompany', { static: true }) public table: Table;
  @ViewChild("checkAllBox") checkAllBox;
  templateOptions:any = [];
  yearRange: any = "2000:2050";
  dateRange: any[];
  asonMonth:any = null;
  @ViewChild('myCalendar') datePicker;
  @ViewChild('monthCalendar') monthPicker;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  constructor(private reportDownloadService:ReportDownloadService,private miscService: MiscellaneousService,private toastrService: ToastrService) { }
  ngOnInit(): void {
    this.toastrService.overlayContainer = this.toastContainer;
    this.getTemplates();
    this.templateOptions = GetTemplatePeriodOptions();
    this.selectedPeriod = this.templateOptions[0];
  }
  getTemplates()
  {
    this.isLoader = true;
    this.reportDownloadService.getInternalReportTemplates().subscribe(
      (result) => {
        this.isLoader = false;
        if(result!=null && result.length > 0)
        {
          this.selectedTemplate=null;
          this.templateList = result;
          this.selectedTemplate = this.templateList[0];
          this.getCompaniesByTemplateId();
        }
      },
      (error) => {
        this.isLoader = false;
      }
    );
  }
  resetAll()
  {
    this.isEnable = true;
    this.checkAllBox.checked = false;
    this.isCompanySheetToggle =  false;
    this.selectedPeriod = this.templateOptions[0];
    this.dateRange = null;
    this.asonMonth = null;
    this.getCompaniesByTemplateId();
  }
  dateRangeSelected()
  {
    if(this.dateRange.length >0 && this.dateRange[1] == null)
    {
      this.dateRange = null;
    }
    this.setStatus();
  }
  download()
  {
    this.isDownload= true;
    let configuration={
      templateId:this.selectedTemplate?.templateId,
      templateName:this.selectedTemplate?.templateName,
      companies:this.companyList.filter(x=>x.isSelected),
      startPeriod:this.datePicker!=undefined ? (this.datePicker.inputFieldValue.split("-").length > 0 ? this.datePicker.inputFieldValue.split("-")[0]:null):null,
      endPeriod:this.datePicker!=undefined ? (this.datePicker.inputFieldValue.split("-").length > 1 ? this.datePicker.inputFieldValue.split("-")[1]:null):null,
      IsCustomPeriod: this.selectedPeriod.value == 2,
      IsCompanyTab:this.isCompanySheetToggle,
      AsOnMonth:this.monthPicker?.inputFieldValue
    };
    this.reportDownloadService.downloadReport(configuration).subscribe(
      (response) => {
        this.isDownload = false;
        if(response!=null)
        {
          if(this.selectedTemplate.excelTemplateName!="Monthly Template")
          {  
            this.miscService.downloadExcelFile(response);
          }
          else
          {
            this.toastrService.success("Your file is getting ready! We will share a link through the email </br> once your file is ready for download", "", { positionClass: "toast-center-center" ,enableHtml: true});
          }
        }
      },
      (error) => {
        this.isDownload = false;
        this.toastrService.error("File not downloaded","",{positionClass:"toast-center-center"});
      }
    );
  }
  getCompaniesByTemplateId()
  {
    this.checkAllBox.checked = false;
    let templateIds= this.selectedTemplate?.templateId?.toString();
    if(templateIds!="")
    {
      this.isLoader = true;
      this.reportDownloadService.getInternalReportCompanies({companyName:templateIds}).subscribe(
        (result) => {
          this.isLoader = false;
          if(result!=null && result.length > 0)
          {
            this.companyList=result;
          }
          else{
            this.companyList=[];
          }
          this.checkAllBox.checked = false;
          this.isCompanySheetToggle =  false;
          this.selectedPeriod = this.templateOptions[0];
          this.dateRange = null;
          this.asonMonth =  null;
          const date = new Date();
          date.setMonth(date.getMonth() - 1);
          this.asonMonth = date;
        },
        (error) => {
          this.isLoader = false;
          this.companyList=[];
        }
      );
    }
    else{
      this.companyList=[];
    }
  }
  handleHeaderCheckBox($event){
    this.setCheckAll($event.checked);
  }
  setCheckAll(status:boolean)
  {
    this.companyList.forEach(item=>{
      item.isSelected = status;
    });
    this.setStatus();
  }
  setStatus()
  {
    let totalStatus = this.companyList.filter(x=>x.isSelected);
    if(totalStatus.length > 0)
    {
       this.isEnable=false;
      if((this.selectedPeriod.name == "Custom Period" && (this.dateRange == null || this.dateRange[1] == null)))
      {
        this.isEnable=true;
      }
    }
    else{
      this.isEnable = true;
    }
  }
  handleCheckBox(rowData,$event)
  {
     rowData.isSelected = $event.target.checked;
     let index= this.companyList.findIndex(x=>x.portfolioCompanyId == rowData.portfolioCompanyId);
     if(index > -1)
     {
      this.companyList[index].isSelected = $event.target.checked;
     }
    let totalStatus = this.companyList.filter(x=>x.isSelected);
    if(totalStatus?.length == this.companyList?.length)
    {
      this.checkAllBox.checked = true;
    }
    else
    {
      this.checkAllBox.checked = false;
    }
   this.setStatus();
  }
}
