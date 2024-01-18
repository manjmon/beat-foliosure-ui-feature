import { CalendarModule } from 'primeng/calendar';
import { SaveDealComponent } from './save-deals.component';
import { SharedComponentModule } from '../../custom-modules/shared-component.module';
import { SharedDirectiveModule } from '../../directives/shared-directive.module';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { AngularResizeEventModule } from 'angular-resize-event';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
@NgModule({
  imports: [
    PrimeNgModule,
    CommonModule,
    FormsModule,
    CalendarModule,
    SharedDirectiveModule,
    SharedComponentModule,
    AngularResizeEventModule,
    RouterModule.forChild([
      { path: '', component: SaveDealComponent }
    ])
  ],
  providers: [    {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true,
  }],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [SaveDealComponent]
})
export class SaveDealsModule { }
