import { EsgModelComponent } from 'src/app/components/esg/esg-model/esg-model.component';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from "../../custom-modules/shared-component.module";
import { CommonModule } from '@angular/common';
import { EsgDatatableComponent } from 'src/app/components/esg/esg-datatable/esg-datatable.component';
import { EsgChartComponent } from 'src/app/components/esg/esg-chart/esg-chart.component';
import { MaterialModule } from 'src/app/custom-modules/material.module';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { AngularResizeEventModule } from 'angular-resize-event';
import { QuillModule } from 'ngx-quill';
import { CanValuationDeactivateGuard } from 'src/app/unsaved-changes/can-deactivate/can-valuation-deactivate.guard';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';

@NgModule({
    declarations: [
        EsgModelComponent,
        EsgDatatableComponent,
        EsgChartComponent
    ],
    providers: [
        CanValuationDeactivateGuard
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA ],
    imports: [
        PrimeNgModule,
        MaterialModule,
        AngularResizeEventModule,
        CommonModule,
        FormsModule,
        SharedDirectiveModule,
        SharedComponentModule,
        RouterModule.forChild([
            { path: '', component: EsgModelComponent, canDeactivate: [CanValuationDeactivateGuard] }
        ]),
        QuillModule.forRoot()
        
    ]
})
export class EsgModel { }