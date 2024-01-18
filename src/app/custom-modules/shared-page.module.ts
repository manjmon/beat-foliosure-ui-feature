import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PorfolioCompanyInfoComponent } from '../components/kpi/porfolio-company-info/porfolio-company-info.component';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    PorfolioCompanyInfoComponent
  ],
  imports: [FormsModule,CommonModule,ScrollingModule],
  exports: [
    PorfolioCompanyInfoComponent
  ]
})
export class SharedPageModule { }