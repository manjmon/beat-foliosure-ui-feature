import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { SharedComponentModule } from './../../custom-modules/shared-component.module';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddFundComponent } from './add-funds.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { SharedPipeModule } from './../../custom-modules/shared-pipe.module';
import { AngularResizeEventModule } from 'angular-resize-event';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgModule,
    SharedComponentModule,
    SharedPipeModule,
    AngularResizeEventModule,
    RouterModule.forChild([
      { path: '', component: AddFundComponent }
    ])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpServiceInterceptor,
      multi: true,
    },
    DatePipe
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AddFundComponent]
})
export class AddFundModule { }
