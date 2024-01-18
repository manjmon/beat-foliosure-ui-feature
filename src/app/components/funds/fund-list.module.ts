import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { AccountService } from 'src/app/services/account.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { TableModule } from 'primeng/table';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { FormsModule } from '@angular/forms';
import { FundListComponent } from './fund-list.component';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    SharedComponentModule,
    SharedDirectiveModule,
    RouterModule.forChild([
      { path: '', component: FundListComponent }
    ])
  ],
  providers: [
    AccountService,MiscellaneousService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpServiceInterceptor,
      multi: true,
    }
  ],
  exports:[FundListComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [FundListComponent]
})
export class FundListModule { }
