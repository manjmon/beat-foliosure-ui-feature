import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "nep-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"],
})
export class InputComponent implements OnInit {
  @Input() placeholder: string = "Input Something";
  @Input() inputstyle: string = "";
  @Input() value: string = "";
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onBlur: EventEmitter<any> = new EventEmitter();
  @Output() onInput: EventEmitter<any> = new EventEmitter();
  @Output() onKeyPress: EventEmitter<any> = new EventEmitter();
  constructor() {}
  ngOnInit() {}
  getStyleClass() {
    return {
      "nep-input": true,
      "nep-input-bottom-border": this.inputstyle === "outlined",
    };
  }
}
