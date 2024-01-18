import { Component, OnInit } from '@angular/core';
import { ReportTypeConstants } from 'src/app/common/constants';
import { ReportDownloadService } from 'src/app/services/report-download.service';

@Component({
  selector: 'app-report-download',
  templateUrl: './report-download.component.html',
  styleUrls: ['./report-download.component.scss']
})
export class ReportDownloadComponent implements OnInit {
 reportTypeConstants: any = null;
 reportTypes:any[]=[];
 selectedTab:any=null;
  constructor(private reportDownloadService:ReportDownloadService) { }
  ngOnInit(): void {
    this.reportTypeConstants = ReportTypeConstants;
    this.getReportTypes();
  }
  getReportTypes()
  {
    this.reportDownloadService.getReportTypes().subscribe(
      (result) => {
        if(result!=null && result.length > 0)
        {
          this.reportTypes = result;
          this.reportTypes[0].active = true;
          this.selectedTab = this.reportTypes[0];
        }
      },
      (error) => {
      }
    );
  }
  onTabClick(tab:any)
  {
    this.selectedTab = tab;
  }
}
