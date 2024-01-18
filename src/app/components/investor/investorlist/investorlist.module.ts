import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageConfigurationService } from 'src/app/services/page-configuration.service';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { MaterialModule } from '../../../custom-modules/material.module';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvestorlistComponent } from '../investorlist/investorlist.component';
import { InvestorService } from 'src/app/services/investor.service';
@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        SharedComponentModule,
        MaterialModule,
        PrimeNgModule,
        ReactiveFormsModule, FormsModule,
        RouterModule.forChild([
            { path: '', component: InvestorlistComponent },
        ])
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [InvestorlistComponent],
    providers: [PageConfigurationService, InvestorService, {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpServiceInterceptor,
        multi: true,
    },]
})
export class InvestorListModule {

}