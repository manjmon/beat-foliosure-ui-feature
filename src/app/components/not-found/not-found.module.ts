import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { NotFoundComponent } from './not-found.component';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentModule,
    RouterModule.forChild([
      { path: '', component: NotFoundComponent }
    ])
  ],
  providers: [    {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true,
  }],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [NotFoundComponent],
})
export class NotFoundModule { }
