import { Component, Input, EventEmitter, Output } from "@angular/core";

@Component({ selector: "nep-table", templateUrl: "./table.component.html" })
export class Table {
  @Input() tableheight: string = '30vw';
  @Input() placeholder: string = "Search";
  @Input() isDynamic: boolean = false;
  @Input() scrollheight: string = '30vw';
  @Input() isCheckbox: boolean = true;
  @Input() headers = [];
  @Input() rowValues = [];
  @Input() ImageBeforeData = "";
  @Input() loading:boolean = false;
  @Output() downloadDocument = new EventEmitter<any>();
  @Output() openDocument = new EventEmitter<any>();
  @Output() onChange = new EventEmitter<any>();
  @Input() checkAll = false;
  @Input() hasBorder = false;
  @Input() colWithClickEvent = "";
  @Output() OnClick = new EventEmitter<any>();
  @Output() OnImageClick = new EventEmitter<any>();
  @Input() ImageAfterData = "";
  @Input() ImagePath = undefined;
  @Output() onLazyLoad = new EventEmitter<any>();
  @Input() ImageSrc = undefined;
  @Input() ImageStyle = "";
  comments: string = "";

  ngDoCheck() {
    if (this.rowValues === undefined) {
      this.rowValues = [];
    }
    this.checkAll = false;
    if (this.rowValues.length > 0 && this.rowValues.find(x => x.isChecked === false) === undefined) {
      this.checkAll = true;
    }
  }

  OnDownloadDocument(id) {
    this.downloadDocument.emit(id);
  }

  IsScrollable() {
    return this.rowValues.length > 10;
  }

  OnOpenDocument(id) {
    this.openDocument.emit(id);
  }

  handleCheckBox(type, document) {
    if (type === 'checkAll') {
      let isChecked = !this.checkAll;
      this.checkAll = isChecked;
      this.rowValues.forEach((doc) => {
        doc.isChecked = isChecked;
      })
    } else {
      this.rowValues.filter(function (doc) {
        if (doc === document) {
          doc.isChecked = !document.isChecked;
        }
      });

      if (this.rowValues.find(x => x.isChecked === false) === undefined) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    }

    this.onChange.emit(this.rowValues);
  }

  OnColClick(data: any) {
    this.OnClick.emit(data);
  }

  OnImgClick(data) {
    this.OnImageClick.emit(data);
  }
  iscommentsPopup: boolean = false;
  viewCommentsPopup(valueComments){
    this.comments = valueComments;
    this.iscommentsPopup= true;
  }
  closeCommentsPopUp(){
    this.comments = "";
    this.iscommentsPopup = false;
  }

}
export class DataSource { }
