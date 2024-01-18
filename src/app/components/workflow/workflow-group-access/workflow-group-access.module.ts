import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { WorkflowStatusComponent } from './workflow-status/workflow-status.component';
import { WorkflowSubFeaturesComponent } from './workflow-sub-features/workflow-sub-features.component';
import { WorkflowFeaturesComponent } from './workflow-features/workflow-features.component';
import { SharedComponentModule } from './../../../custom-modules/shared-component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowGroupAccessComponent } from './workflow-group-access.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { WorkflowAccessService } from 'src/app/services/workflow-access.service';
import { WorkflowGroupsComponent } from './workflow-groups/workflow-groups.component';
import { WorkflowUsersComponent } from './workflow-users/workflow-users.component';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { MaterialModule } from 'src/app/custom-modules/material.module';
import { WorkflowFeatureService } from 'src/app/services/workflow-feature.service';
import { AddUsersComponent } from './workflow-users/add-users/add-users.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedComponentModule,
    SharedDirectiveModule,
    PrimeNgModule,
    RouterModule.forChild([
      { path: '', component: WorkflowGroupAccessComponent }
    ])
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true,
  },
    WorkflowAccessService,
    WorkflowFeatureService
  ],
  declarations: [
    WorkflowGroupAccessComponent,
    WorkflowGroupsComponent,
    WorkflowFeaturesComponent,
    WorkflowSubFeaturesComponent,
    WorkflowUsersComponent,
    WorkflowStatusComponent,
    AddUsersComponent
  ]
})
export class WorkflowGroupAccessModule { }
