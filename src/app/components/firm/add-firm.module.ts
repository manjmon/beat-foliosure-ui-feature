import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { AddFirmComponent } from './add-firm.component';
import { ConfirmationService } from 'primeng/api';
import { AccountService } from 'src/app/services/account.service';
import { FirmService } from 'src/app/services/firm.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessagesModule } from 'primeng/messages';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AngularResizeEventModule } from 'angular-resize-event';

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    // NgbTabsetModule,
    AutoCompleteModule,
    MessagesModule,
    ConfirmDialogModule,
    MatCheckboxModule,
    SharedComponentModule,
    AngularResizeEventModule,
    RouterModule.forChild([
      { path: '', component: AddFirmComponent }
    ])
  ],
  providers: [
    ConfirmationService,AccountService,FirmService,MiscellaneousService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpServiceInterceptor,
      multi: true,
    }
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AddFirmComponent]
})
export class AddFirmModule { }
