import { Component, OnInit } from '@angular/core';
import { PageConfigurationService } from 'src/app/services/page-configuration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-configuration',
  templateUrl: './report-page-configuration.component.html',
  styleUrls: ['./report-page-configuration.component.scss']
})
export class ReportPageConfigurationComponent implements OnInit {
  configurationList: any = []
  constructor(private pageConfigurationService: PageConfigurationService, private router:Router) { }

  ngOnInit() {
    this.getConfiguration();
  }
  getConfiguration() {
    this.pageConfigurationService.getConfiguration()
    .subscribe(
      (result) => {
      this.configurationList=result;
      }, (error) => {
      });
  }

  openConfiguartion(config){
    if(config.title === "LP Report"){
      this.router.navigateByUrl('/lp-report-configuration')
    }
    if(config.title === "Fund Report"){
      this.router.navigateByUrl('/fund-report-configuration')
    }
    if(config.title === "Internal Report"){
      this.router.navigateByUrl('/internal-report-configuration')
    }
    if(config.title === "Fund of Fund Report"){
      this.router.navigateByUrl('/consolidated-report-configuration')
    }
  }
}
