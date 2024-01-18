import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pop-up-loader',
  templateUrl: './pop-up-loader.component.html'
})
export class PopUpLoaderComponent implements OnInit {
  @Input() customwidth: string = "456px";
  constructor() { }

  ngOnInit() {
  }
}
