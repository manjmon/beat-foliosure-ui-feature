import { NumberOnlyDirective } from './validate-numbers.directive';
import { CheckPermissionDirective } from 'src/app/directives/check-permission.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatNumbersPipe } from '../pipes/minus-sign-to-brackets';
import { DndDirective } from './dnd.directive';
import { AutofocusDirective } from './autofocus.directive';
@NgModule({
  declarations: [
    CheckPermissionDirective,
    FormatNumbersPipe,
    NumberOnlyDirective,
    DndDirective,
    AutofocusDirective
  
  ],
  imports: [
    CommonModule
  ],
  exports: [CheckPermissionDirective,FormatNumbersPipe,NumberOnlyDirective,DndDirective, AutofocusDirective],
  providers: [],
  bootstrap: []
})
export class SharedDirectiveModule { }
