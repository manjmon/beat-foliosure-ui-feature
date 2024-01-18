import { Component, EventEmitter, Input,  OnInit } from '@angular/core';
@Component({ 
  selector: "nep-pdfviewer", 
  templateUrl: "./pdfviewer.component.html",
  styleUrls: ['./pdfviewer.component.scss'] 
})
export class PdfviewerComponent implements OnInit  {
  @Input() pdfsource: string = '';
  @Input() isDownload: string = 'false';
  
  constructor() { }
  ngOnInit() {
  }
}
