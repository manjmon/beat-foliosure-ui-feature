import { UnauthorizedaccesComponent } from './components/unauthorizedacces/unauthorizedacces.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BarChartComponent } from './components/chart/barChart';
import { BubbleChartComponent } from './components/chart/bubbleChart';
import { DonutChartComponent } from './components/chart/donutChart';
import { LineBarChartComponent } from './components/chart/lineBarChart';
import { LineChartComponent } from './components/chart/lineChart';
import { MultilineChartComponent } from './components/chart/multilineChart';
import { PortfolioCompanyDataExtractionComponent } from './components/dataExtraction/portfolioCompany-DataExtraction.component';
import { AuthGuard } from './guards';
import { OpenDocumentComponent } from './components/repository/open-document/open-document.component';
import { ViewPCAduitlogsComponent } from './components/portfolioCompany/view-pc-aduitlogs/view-pc-aduitlogs.component';
import { MasterComponent } from './components/master/master.component';
import { MasterModule } from './components/master/master.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/home/home.module').then(mod => mod.HomeModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
       loadChildren: () => import('./components/home/home.module').then(mod => mod.HomeModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'create-fund/:id',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/funds/add-funds.module').then(mod => mod.AddFundModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'create-fund',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/funds/add-funds.module').then(mod => mod.AddFundModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'dynamic-queries',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/queries/dynamic-queries.module').then(mod => mod.DynamicQueriesModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'create-update-queries/:id',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
       loadChildren: () => import('./components/queries/add-queries.module').then(mod => mod.AddDynamicQueriesModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'create-update-queries',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/queries/add-queries.module').then(mod => mod.AddDynamicQueriesModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'fund-list',
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        loadChildren: () => import('./components/funds/fund-list.module').then(mod => mod.FundListModule),
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'repository',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
       loadChildren: () => import('./components/repository/repository-list.module').then(mod => mod.RepositoryListModule),
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'open-document/:id',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        component: OpenDocumentComponent,
      },
    ]
  },
  {
    path: 'open-document',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        component: OpenDocumentComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'add-firm/:id',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/firm/add-firm.module').then(mod => mod.AddFirmModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'firm',
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        loadChildren: () => import('./components/firm/firm-list.module').then(mod => mod.FirmListModule),
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'add-firm',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
       loadChildren: () => import('./components/firm/add-firm.module').then(mod => mod.AddFirmModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path:  'firm-details/:id',
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        loadChildren: () => import('./components/firm/firm-details.module').then(mod => mod.FirmDetailsModule),
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'fund-details/:id',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/funds/fund-details.module').then(mod => mod.FundDetailsModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'portfolio-company',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/portfolioCompany/portfolioCompany-list.module').then(mod => mod.PortfolioCompanyListModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'portfolio-company-detail/:id',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/portfolioCompany/portfolioCompany-detail.module').then(mod => mod.PCDetailModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'add-portfolio-company/:id',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/portfolioCompany/add-portfolioCompany.module').then(mod => mod.AddPCModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'add-portfolio-company',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/portfolioCompany/add-portfolioCompany.module').then(mod => mod.AddPCModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'save-deal',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
       loadChildren: () => import('./components/Deal/save-deals.module').then(mod => mod.SaveDealsModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'save-deal/:id',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/Deal/save-deals.module').then(mod => mod.SaveDealsModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'deal-list',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
       loadChildren: () => import('./components/Deal/deal-list.module').then(mod => mod.DealListModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'deal-details/:id',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
       loadChildren: () => import('./components/Deal/deal-details.module').then(mod => mod.DealDetailsModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'save-portfolio-fundholding',
  //   component: MasterComponent,
  //   children: [
  //     {
  //       outlet: 'master',
  //       path: '',
  //       component: SavePortfolioFundHoldingComponent,
  //     },
  //   ],
  //   canActivate: [AuthGuard],
  // },
  {
    path: 'pipeline/:id',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/pipeline/add-pipeline.module').then(mod => mod.AddPipelineModule),
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'pipeline',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/pipeline/add-pipeline.module').then(mod => mod.AddPipelineModule),
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'pipeline-list',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/pipeline/pipeline-list.module').then(mod => mod.PipelineListModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'pipeline-details/:id',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/pipeline/pipeline-details.module').then(mod => mod.PipelineDetailModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'bar-chart',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        component: BarChartComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'bubble-chart',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        component: BubbleChartComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'donut-chart',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        component: DonutChartComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'line-chart',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        component: LineChartComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'multiline-chart',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        component: MultilineChartComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'line-bar-chart',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        component: LineBarChartComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
{
    path: 'reports/Attribution',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/reports/attribution/attribution-reports.module').then(mod => mod.AttributionReportsModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'reports/Holdings',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/reports/holdings/holding-reports.module').then(mod => mod.HoldingReportsModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'reports/ValuationCharts',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/reports/valuation/valuation-reports.module').then(mod => mod.ValuationReportsModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'reports/CompanyFinancials',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/reports/CompanyFinancials/cf-home-reports.module').then(mod => mod.CFHomeReportsModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'bulk-upload',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/file-uploads/bulk-upload.module').then(mod => mod.BulkUploadModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'cashflow-list',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/cashflow/cashflow-list.module').then(mod => mod.CashflowListModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'cashflow/:id',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/cashflow/cashflow.module').then(mod => mod.CashflowModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'cashflow',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/cashflow/cashflow.module').then(mod => mod.CashflowModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'change-password/:id',
    loadChildren: () => import('./components/auth/login.module')
      .then(mod => mod.LoginModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'dataextraction',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        component: PortfolioCompanyDataExtractionComponent,
      },
    ],
  },
  {
    path: 'save-kpi',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/kpi/save-kpi.module').then(mod => mod.SaveKPIModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'audit-logs',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        component: ViewPCAduitlogsComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'kpi-list',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/kpi/kpi-list.module').then(mod => mod.KpiListModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "401",
    component: MasterComponent,
    children: [{
      outlet: 'master',
      path: '',
      component: UnauthorizedaccesComponent
    // loadChildren: () => import('./components/unauthorizedacces/unauthorizedaccess.module').then(mod => mod.UnAuthorizedModule)
    }
    ]
  },
  {
    path: "404",
    component: MasterComponent,
    children: [{
      outlet: 'master',
      path: '',
      component: PageNotFoundComponent
    }
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('./components/auth/login.module').then(mod => mod.LoginModule)
  },
  {
    path: "in",
    loadChildren: ()=> import('./components/Authentication/oauth-login.module').then(mod => mod.OAuthLoginModule),
  },
  {
    path: "out",
    loadChildren: ()=> import('./components/Authentication/oauth-logout.module').then(mod => mod.OAuthLogoutModule),
  },
  {
    path: "refresh",
    loadChildren: ()=> import('./components/Authentication/oauth-refresh.module').then(mod => mod.OAuthRefreshModule),
  },
  {
    path: 'reset-password/:id',
    loadChildren: () => import('./components/auth/login.module').then(mod => mod.LoginModule)
  },
  {
    path: 'report-template',
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        loadChildren: () => import('./components/report-page-configuration/report-page-configuration.module').then(mod => mod.PageConfigurationModule)
      }
    ]
  },
  {
    path: 'fxrates',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/fxrates/fxrates.module').then(mod => mod.FxratesModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'lp-report-configuration',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/LpTemplateConfiguration/LpTemplateConfiguration.module').then(mod => mod.LpTemplateConfigurationModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'workflow/company-draft/:id',
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        loadChildren: () => import('./components/workflow/portfolio-company-draft/portfolio-company-draft.module').then(mod => mod.PortfolioCompanyDraftModule)
      }
    ]
  },
  {
    path: 'workflow/group-access',
    component: MasterComponent,
    children: [
      {
        outlet: "master",
        path: "",
        loadChildren: () => import('./components/workflow/workflow-group-access/workflow-group-access.module').then(mod => mod.WorkflowGroupAccessModule)
      }
    ]
  },
  {
    path: 'fund-report-configuration',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/fund-report/fund-report.module').then(mod => mod.FundreportModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'page-config',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/page-settings/page-settings.module').then(mod => mod.PageSettingsModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'addinvestor',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/investor/addinvestor.module').then(mod => mod.AddinvestorModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'addinvestor/:id',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/investor/addinvestor.module').then(mod => mod.AddinvestorModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'investorlist',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/investor/investorlist/investorlist.module').then(mod => mod.InvestorListModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'investor-details/:id',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/investor/investorDetails/investorDetails.module').then(mod => mod.InvestorDetailsModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'client-reporting',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/client-reporting/client-reporting.module').then(mod => mod.ClientReportingModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'internal-report-configuration',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/internal-report/internal-report.module').then(mod => mod.InternalReportModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'consolidated-report-configuration',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/consolidated-report/consolidated-report.module').then(mod => mod.ConsolidatedReportModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'report-download',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/report-download/report-download.module').then(mod => mod.ReportDownloadModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'valuation-model',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/Valuation-Model/valuation-model.module').then(mod => mod.ValuationModelModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'ESG',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/esg/esg-model.module').then(mod => mod.EsgModel)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'report-download-bg/:id',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
        loadChildren: () => import('./components/report-download/report-download-bg/report-download-bg.module').then(mod => mod.ReportDownloadBgModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'fileuploadstatus',
    component: MasterComponent,
    children: [
      {
        outlet: 'master',
        path: '',
       loadChildren: () => import('./components/master/file-upload-error/file-upload-error.module').then(mod => mod.FileUploadErrorModule)
      },
    ],
    canActivate: [AuthGuard],
  },
  { path: '**', pathMatch: 'full',component: PageNotFoundComponent }
];
@NgModule({
  imports: [MasterModule, RouterModule.forRoot(routes, { useHash: true },)],
  exports: [RouterModule],
  providers: [
    { provide: 'BASE_URL', useFactory: getBaseUrl },
    { provide: 'Pager_Option', useFactory: getPagerOption },
  ],
})
export class AppRoutingModule { }

export function getBaseUrl() {
  return environment.apiBaseUrl;
}
export function getPagerOption() {
  return '[10,25,100]';
}