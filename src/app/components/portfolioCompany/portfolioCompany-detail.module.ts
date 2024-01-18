import { MaterialModule } from './../../custom-modules/material.module';
import { PrimeNgModule } from './../../custom-modules/prime-ng.module';
import { PortfolioCompanyDetailComponent } from './portfolioCompany-detail.component';
import { SharedComponentModule } from './../../custom-modules/shared-component.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { PortfolioOperationalKPIComponent } from './operational-kpi/portfolioCompany-detail.operational-KPI.component';
import { PortfolioCompanyInvestmentKPIComponent } from './portfolioCompany-InvestmentKPI.component';
import { PortfolioCompanyImpactKPIComponent } from './portfolioCompany-ImpactKPI.component';
import { PortfolioCompanyKPIComponent } from './portfolioCompany-CompanyKPI.component';
import { UpdateInfoSectionComponent } from './update-info-section.component';
import { SavePortfolioProfitabilityComponent } from './portfolioCompany-profitability.component';
import { SavePortfolioOperationalKPIComponent } from './portfolioCompany-operationalKPI.component';
import { ImpactuploadComponent } from '../impactupload/impactupload.component';
import { MasterKpiComponent } from './master-kpi/master-kpi.component';
import { TableheaderfilterComponent } from '../table-headerfilter/table-headerfilter.component';
import { InvestmentKpiGraphComponent } from './investment-kpi-graph/investment-kpi-graph.component';
import { OperationalKpiGraphComponent } from './operational-kpi-graph/operational-kpi-graph.component';
import { CompanyKpiGraphComponent } from './company-kpi-graph/company-kpi-graph.component';
import { MasterKpiGraphComponent } from './master-kpi-graph/master-kpi-graph.component';
import { CheckUserPermissionDirective } from 'src/app/directives/CheckUserPermission.directive';
import { MasterKpiService } from 'src/app/services/master-kpi.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { HtmltopdfComponent} from '../htmltopdf/htmltopdf.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedPipeModule } from './../../custom-modules/shared-pipe.module';
import { AngularResizeEventModule } from 'angular-resize-event';
import { FootNoteComponent } from '../foot-note/foot-note.component';
import { QuillModule } from 'ngx-quill';
import { FootNoteService } from 'src/app/services/foot-note.service';
import {FinancialsBetaComponent} from 'src/app/components/portfolioCompany/financials-beta/financials-beta.component';
import { ProfitLossBetaComponent } from './financials-beta/profit-loss-beta/profit-loss-beta.component';
import { BalanceSheetBetaComponent } from './financials-beta/balance-sheet-beta/balance-sheet-beta.component';
import { CashflowBetaComponent } from './financials-beta/cashflow-beta/cashflow-beta.component';
import{ProfitLossService} from '../../services/profit-loss.service';
import{BalanceSheetService} from '../../services/balance-sheet.service';
import{CashflowBetaService} from '../../services/cashflow-beta.service';import { MasterKpiBetaComponent } from './master-kpi-beta/master-kpi-beta.component';
import { OperationalKpiBetaComponent } from './operational-kpi-beta/operational-kpi-beta.component';
import { MasterKpiGraphBetaComponent } from './master-kpi-graph-beta/master-kpi-graph-beta.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PrimeNgModule,
        MaterialModule,
        HttpClientModule,
        SharedComponentModule,
        SharedDirectiveModule,
        RouterModule.forChild([
            { path: '', component: PortfolioCompanyDetailComponent }
        ]),
        AngularEditorModule,
        SharedPipeModule,
        AngularResizeEventModule,
        QuillModule.forRoot()
    ], 
    providers: [
        MasterKpiService,
        CurrencyService,
        CashflowBetaService,
        BalanceSheetService,
        ProfitLossService,
        FootNoteService,
        {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpServiceInterceptor,
        multi: true,
    }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        PortfolioCompanyDetailComponent, 
        PortfolioOperationalKPIComponent,
        PortfolioCompanyInvestmentKPIComponent,
        PortfolioCompanyImpactKPIComponent,
        PortfolioCompanyKPIComponent,
        UpdateInfoSectionComponent,
        SavePortfolioProfitabilityComponent,
        SavePortfolioOperationalKPIComponent,
        ImpactuploadComponent,
        MasterKpiComponent,
        TableheaderfilterComponent,
        InvestmentKpiGraphComponent,
        OperationalKpiGraphComponent,
        CompanyKpiGraphComponent,
        MasterKpiGraphComponent,
        CheckUserPermissionDirective,       
        HtmltopdfComponent,
        FootNoteComponent,
        FinancialsBetaComponent,
        ProfitLossBetaComponent,
        BalanceSheetBetaComponent,
        CashflowBetaComponent,
        MasterKpiBetaComponent,
        OperationalKpiBetaComponent,
        MasterKpiGraphBetaComponent
    ]
    
})
export class PCDetailModule { }