import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { ReportDownloadService } from 'src/app/services/report-download.service';

@Component({
  selector: 'app-report-download-bg',
  templateUrl: './report-download-bg.component.html',
  styleUrls: ['./report-download-bg.component.scss']
})
export class ReportDownloadBgComponent{
  constructor(private reportDownloadService:ReportDownloadService,private miscService: MiscellaneousService, private _avRoute: ActivatedRoute,) { 
    if (this._avRoute.snapshot.params["id"]) {
      let jobId = this._avRoute.snapshot.params["id"];
      this.downloadReport(jobId);
    }
  }
  downloadReport(jobId:any)
  {
    this.reportDownloadService.downloadBackgroundReport(jobId).subscribe(
      (result) => {
        this.miscService.downloadExcelFile(result);
      },
      (error) => {
      }
    );
  }
}
