import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { DynamicQueriesListComponent } from './dynamic-queries.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    SharedDirectiveModule,
    RouterModule.forChild([
      { path: '', component: DynamicQueriesListComponent }
    ])
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [DynamicQueriesListComponent],
})
export class DynamicQueriesModule { }
