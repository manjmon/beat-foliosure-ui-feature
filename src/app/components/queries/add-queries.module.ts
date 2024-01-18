import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddQueryComponent } from './add-queries.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    RouterModule.forChild([
      { path: '', component: AddQueryComponent }
    ])
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AddQueryComponent],
})
export class AddDynamicQueriesModule { }
