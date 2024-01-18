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
import { InvestorDetailsComponent } from './investorDetails.component';
import { InvestorService } from 'src/app/services/investor.service';
import { InvestorDashboardComponent } from '../investorDashboard/investorDashboard.component';
import { AngularResizeEventModule } from 'angular-resize-event';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        SharedComponentModule,
        SharedDirectiveModule,
        MaterialModule,
        PrimeNgModule,
        ReactiveFormsModule, FormsModule,AngularResizeEventModule,
        RouterModule.forChild([
            { path: '', component: InvestorDetailsComponent }
        ])
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [InvestorDetailsComponent,InvestorDashboardComponent],
    providers: [PageConfigurationService, InvestorService, {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpServiceInterceptor,
        multi: true,
    },]
})
export class InvestorDetailsModule {

}