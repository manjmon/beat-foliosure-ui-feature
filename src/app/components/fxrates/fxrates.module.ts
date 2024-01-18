import { SharedComponentModule } from './../../custom-modules/shared-component.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from '../../custom-modules/material.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { FxratesComponent } from '../fxrates/fxrates.component';
import { CurrencyService } from "src/app/services/currency.service";
import { TableModule } from 'primeng/table';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    DropdownModule,
    MaterialModule,
    SharedComponentModule,
    HttpClientModule,
    SharedDirectiveModule,
    TableModule,
    PrimeNgModule,
    RouterModule.forChild([
      { path: '', component: FxratesComponent }
    ])
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true,
  },CurrencyService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [FxratesComponent]
})
export class FxratesModule { }
