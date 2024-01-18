import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioCompanyDraftComponent } from './portfolio-company-draft.component';
import { RouterModule } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { WorkflowCompanyService } from 'src/app/services/workflow-company.service';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { WorkflowCompanyinfoComponent } from '../workflow-companyinfo/workflow-companyinfo.component';
import { WorkflowInvestmentKpiComponent } from '../workflow-investment-kpi/workflow-investment-kpi.component';
import { WorkflowBulkUploadComponent } from '../workflow-bulk-upload/workflow-bulk-upload.component';
import { WorkflowCompanyKpiComponent } from '../workflow-company-kpi/workflow-company-kpi.component';
import { MatMenuModule } from '@angular/material/menu';
import { WorkflowOperationalKpiComponent } from '../workflow-operational-kpi/workflow-operational-kpi.component';
import { WorkflowInvestmentService } from 'src/app/services/WorkflowInvestmentService';
import { WorkflowTradingRecordsService } from 'src/app/services/workflow-trading-records.service';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { SharedPipeModule } from '../../../custom-modules/shared-pipe.module';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { WorkflowTradingRecordsKpiComponent } from '../workflow-trading-records-kpi/workflow-trading-records-kpi.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatMenuModule,
    PrimeNgModule,
    HttpClientModule,
    SharedComponentModule,    
    SharedPipeModule,
    SharedDirectiveModule,
    RouterModule.forChild([
      { path: '', component: PortfolioCompanyDraftComponent }
    ])
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true,
  },
  WorkflowCompanyService,
  WorkflowInvestmentService,
  WorkflowTradingRecordsService
],
  declarations: [  
    PortfolioCompanyDraftComponent,
    WorkflowCompanyinfoComponent,
    WorkflowInvestmentKpiComponent,
    WorkflowBulkUploadComponent,
    WorkflowCompanyKpiComponent,
    WorkflowOperationalKpiComponent,
    WorkflowTradingRecordsKpiComponent
  ]
})
export class PortfolioCompanyDraftModule { }
