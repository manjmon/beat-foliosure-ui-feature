import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { MatMenuModule } from '@angular/material/menu';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { PortfolioCompanyListComponent } from './portfolioCompany-list.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { PublishedComponent } from './published/published.component';
import { CompanyFilterPipe } from './published/filters/company-filter-pipe';
import { PortfolioCompanyDraftComponent } from './draft/portfolio-company-draft-list/portfolio-company-draft-list.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    PrimeNgModule,
    SharedDirectiveModule,
    SharedComponentModule,
    DropdownModule,
    CalendarModule,
    RouterModule.forChild([
      { path: '', component: PortfolioCompanyListComponent }
    ])
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [PortfolioCompanyListComponent, PublishedComponent,CompanyFilterPipe, PortfolioCompanyDraftComponent ],
})
export class PortfolioCompanyListModule { }
