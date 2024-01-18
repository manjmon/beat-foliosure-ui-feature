import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CashflowComponent } from './cashflow.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { MatchObjectPipe } from 'src/app/pipes/matchObject.pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgModule,
    SharedDirectiveModule,
    SharedComponentModule,
    RouterModule.forChild([
      { path: '', component: CashflowComponent }
    ])
  ],
  providers: [  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true,
  }],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [CashflowComponent,MatchObjectPipe],
})
export class CashflowModule { }