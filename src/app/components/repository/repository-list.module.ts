import { NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RepositoryListComponent } from './repository-list.component';
import { CUSTOM_ELEMENTS_SCHEMA, forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddRepositoryComponent } from './add-repository.component';
import { MaterialModule } from 'src/app/custom-modules/material.module';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { AdvanceFiltersComponentComponent } from '../advance-filters-component/advance-filters.component';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { ProgressComponent } from '../progress/progress.component';
import { PopularTagsComponent } from '../popular-tags/popular-tags.component';
import { OpenDocumentComponent } from './open-document/open-document.component';
import { Chips } from 'projects/ng-neptune/src/lib/chip/chip.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgModule,
    ReactiveFormsModule,
    SharedDirectiveModule,
    SharedComponentModule,
    MaterialModule,
    RouterModule.forChild([
      { path: '', component: RepositoryListComponent }
    ])
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RepositoryListComponent),
      multi: true,
    },
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [RepositoryListComponent,AddRepositoryComponent,Chips,
    AdvanceFiltersComponentComponent,ProgressComponent,PopularTagsComponent,OpenDocumentComponent]
})
export class RepositoryListModule { }
