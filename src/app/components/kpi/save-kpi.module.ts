import { SaveKPIComponent } from './save-kpi.component';
import { SharedPageModule } from './../../custom-modules/shared-page.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SharedComponentModule,
    SharedPageModule,
    RouterModule.forChild([
      { path: '', component: SaveKPIComponent }
    ])
  ],
  providers: [
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [SaveKPIComponent]
})
export class SaveKPIModule { }
