import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-unauthorizedacces',
  templateUrl: './unauthorizedacces.component.html',
  styleUrls: ['./unauthorizedacces.component.scss']
})
export class UnauthorizedaccesComponent implements OnInit {
  @Input() isHideAuthImage = true;
  constructor() { 
    // will do
  }
  ngOnInit() {
    // will do
  }

}
