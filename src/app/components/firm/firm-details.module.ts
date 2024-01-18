import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { AccountService } from 'src/app/services/account.service';
import { FirmService } from 'src/app/services/firm.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { FirmDetailsComponent } from './firm-details.component';

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: FirmDetailsComponent }
    ])
  ],
  providers: [
    AccountService,FirmService,MiscellaneousService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpServiceInterceptor,
      multi: true,
    }
  ],
  exports:[FirmDetailsComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [FirmDetailsComponent]
})
export class FirmDetailsModule { }
//Remove AddFirmComponent,LocationControlComponent,TypeAheadControlComponent from app.modeule.ts when all these components are made to lazy load
