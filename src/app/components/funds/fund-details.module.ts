import { AddFundTrackRecordComponent } from './fund-trackRecord.component';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { AccountService } from 'src/app/services/account.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { FormsModule } from '@angular/forms';
import { FundDetailsComponent } from './fund-details.component';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { DealService } from 'src/app/services/deal.service';
import { FundService } from 'src/app/services/funds.service';
import { ReportService } from 'src/app/services/report.service';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { TrackrecordsComponent } from './trackrecords/trackrecords.component';
import { FundReportService } from 'src/app/services/fund-report.service';
import { AngularResizeEventModule } from 'angular-resize-event';
import { MaterialModule } from 'src/app/custom-modules/material.module';

@NgModule({
  imports: [
    CommonModule,
    PrimeNgModule,
    FormsModule,
    MaterialModule,
    SharedDirectiveModule,
    SharedComponentModule,
    RouterModule.forChild([
      { path: '', component: FundDetailsComponent }
    ]),
    AngularResizeEventModule
  ],
  providers: [
    PortfolioCompanyService,MiscellaneousService,AccountService,FundService,DealService,ReportService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpServiceInterceptor,
      multi: true,
    },
    FundReportService
  ],
  exports:[FundDetailsComponent,TrackrecordsComponent,AddFundTrackRecordComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [FundDetailsComponent,TrackrecordsComponent,AddFundTrackRecordComponent]
})
export class FundDetailsModule { }
