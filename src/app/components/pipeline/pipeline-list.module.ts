import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PipelineListComponent } from './pipeline-list.component';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { PipelineDashboardComponent} from './pipeline-dashboard.component';
import { AngularResizeEventModule } from 'angular-resize-event';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    SharedDirectiveModule,
    SharedComponentModule,
    RouterModule.forChild([
      { path: '', component: PipelineListComponent }
    ]),
    AngularResizeEventModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [PipelineListComponent,PipelineDashboardComponent],
})
export class PipelineListModule { }
