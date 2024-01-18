import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrayFilterPipe } from 'src/app/pipes/array-filter.pipe';
import { PortfolioCustomListPipe } from '../pipes/portfolioCustomList.pipe';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
@NgModule({
  imports: [
    CommonModule   
   
  ],
  declarations: [ArrayFilterPipe,PortfolioCustomListPipe, SanitizeHtmlPipe],
  exports:[ArrayFilterPipe,PortfolioCustomListPipe, SanitizeHtmlPipe]  
})
export class SharedPipeModule { }
