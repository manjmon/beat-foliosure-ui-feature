import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponentComponent implements OnInit {

  @Input() width = 0;
  @Input() height = 0;
  @Input() marginLeft = 0;
  @Input() marginTop = 0;
  @Input() isChecked = false;
  @Input() value = "";
  @Input() disabled = false;

  contentMarginLeft = this.width+12+'px';

  constructor() { }

  ngOnInit() {
  }

}
