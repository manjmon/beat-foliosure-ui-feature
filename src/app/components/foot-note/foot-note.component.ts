import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FootNoteService } from 'src/app/services/foot-note.service';
import Quill from 'quill';
const FontAttributor = Quill.import('attributors/class/font');
FontAttributor.whitelist = [
  'Helvetica','HelveticaMedium','Arial','TimesNewRoman','Garamond','PalatinoLinotype','monospace','sans-serif','serif','Georgia','Cambria','Calibri','Verdana','Corbel','FranklinGothic'
];
Quill.register(FontAttributor, true);
const FontSize= Quill.import('attributors/class/size');
FontSize.whitelist = [
  '8px','10px', '12px', '14px', '16px', '18px', '20px', '22px', '24px','26px','28px','30px','32px'
];
Quill.register(FontSize, true);
@Component({
  selector: 'app-foot-note',
  templateUrl: './foot-note.component.html',
  styleUrls: ['./foot-note.component.scss']
})
export class FootNoteComponent implements OnChanges {
  footNoteText:string ="";
  @Input() moduleId:number =0;
  @Input() companyId:number = 0;
  footNoteModel:any = null;
 @ViewChild('editor') editor;
  quillConfig={
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'header': 1 }, { 'header': 2 }], 
      [{ 'color': ['red','black','#021155','#75787B','#55565A','#eee','green','orange','#021155'] }, { 'background': ['red','black','#021155','#75787B','#55565A','#eee','green','orange','#021155'] }],
      [{ 'align': [false, 'center', 'right', 'justify'] }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{'font': ['Helvetica','HelveticaMedium','Arial','TimesNewRoman','Garamond','PalatinoLinotype','monospace','sans-serif','serif','Georgia','Cambria','Calibri','Verdana','Corbel','FranklinGothic']}],
      [{ 'size': ['8px','10px', '12px', '14px', '16px', '18px', '20px', '22px', '24px','26px','28px','30px','32px'] }],
      ['link']
  ]
    }
  constructor(private footNoteService:FootNoteService) { }
  ngOnChanges(changes:SimpleChanges)
  {
    if(changes["moduleId"] && changes["companyId"])
    {
      this.getNote();
    }
  }
  onSelectionChanged = (event) =>{
    if(event.oldRange == null){
      this.onFocus();
    }
    if(event.range == null){
      this.onBlur();
    }
  }
  onContentChanged = (event) =>{
  }
  onFocus = () =>{
  }
  onBlur = () =>{
  }
  saveNote()
  {
    if(this.checkFootnote())
    {
      if(this.footNoteModel==null && this.footNoteText!="")
      {
        this.addFootNote();
      }
      if(this.footNoteModel!=null){
        this.updateFootNote();
      }
    }
  }
  checkFootnote()
  {
    return this.footNoteModel?.footNote?.trim()!=this.footNoteText?.trim();
  }
  getNote()
  {
    this.footNoteService.getFootNote(this.moduleId, this.companyId).subscribe({next:
      (result: any) => {
        this.footNoteModel = result;
        if(result!=null)
        {
          this.footNoteText = result.footNote;
        }
      },
      error:(error) => {}
  });
  }
  setFocus()
  {
          let element = document.getElementsByClassName("ql-editor")[0] as HTMLDivElement;
          element.focus();
  }
  addFootNote()
  {
    let model ={
      FootNote:this.footNoteText,
      ModuleId:this.moduleId,
      CompanyId:this.companyId
    };
    this.footNoteService.addFootNote(model).subscribe({
      next:(result: any) => {
        this.getNote();
      },
      error:(error) => {}
  });
  }
  updateFootNote()
  {
    let model = {
      FootNoteId: this.footNoteModel.footNoteId,
      FootNote: this.footNoteText,
      ModuleId: this.moduleId,
      CompanyId: this.companyId,
    };
    this.footNoteService.updateFootNote(model).subscribe({
      next:(result: any) => {
        this.getNote();
      },
      error:(error) => {}
  });
  }
}
