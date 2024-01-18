import { Router } from '@angular/router';
import { Component } from "@angular/core";
@Component({
  selector: "not-found",
  templateUrl: "./not-found.component.html"
})
export class NotFoundComponent {
  constructor(
    private router: Router) { }
}
