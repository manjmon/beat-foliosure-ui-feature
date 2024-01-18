import { Component, Input, OnInit , DoCheck, Output, EventEmitter} from '@angular/core';
import { DocumentService } from "../../services/document.service";

@Component({
  selector: 'popular-tags',
  templateUrl: './popular-tags.component.html',
})
export class PopularTagsComponent implements OnInit, DoCheck {

  tags = [];
  @Input() foldername = "Shared folder";
  prevFolderName = "";
  loader = false;
  @Input() updatePopularTags = false;
  @Output() resetUpdatePopularTags = new EventEmitter<any>();
  constructor(private documentService: DocumentService,) { }

  ngOnInit() {
    this.getPopularTags();
  }
  
  ngDoCheck() {
    if(this.prevFolderName !== this.foldername || this.updatePopularTags) {
      this.getPopularTags();
      this.prevFolderName = this.foldername;
      this.updatePopularTags = false;
      this.resetUpdatePopularTags.emit();
    }
  }

  getPopularTags() {
    this.loader = true;
    this.documentService.getPopularTags(this.foldername).subscribe({
      next:(result) => {
      this.loader = false;
      this.tags= JSON.parse(JSON.stringify(result));
      },
      error:(error) => {
      }
  });
  }
}