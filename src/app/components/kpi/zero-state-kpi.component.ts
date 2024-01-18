import { Component, Input } from '@angular/core';

@Component({
  selector: 'zero-state-kpi',
  templateUrl: './zero-state-kpi.component.html',
})
export class ZeroStateKpiComponent{
  @Input() message ="";
  @Input() header ="";
  @Input() loading = false;
  @Input() height = '66vh';
}
