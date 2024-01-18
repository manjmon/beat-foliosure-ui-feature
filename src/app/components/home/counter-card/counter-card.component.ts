import { Component, Input } from "@angular/core";

@Component({
  selector: "counter-card",
  templateUrl: "./counter-card.component.html",
  styleUrls: ["./counter-card.component.scss"],
})
export class CounterCardComponent {
  @Input() Item: string;
  @Input() Value: string;
  @Input() Unit:string;
  @Input() Currency:string;
}
