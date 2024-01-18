import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html'
})
export class EmptyStateComponent implements OnInit {
  @Input() isGraphImage: boolean = false;
  @Input() message:any =null;
  constructor() { }

  ngOnInit() {
  }
}
