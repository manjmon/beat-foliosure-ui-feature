import {Component, ChangeDetectorRef, forwardRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import Quill from 'quill';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import {ListExt} from './extension';
Quill.register(ListExt, true);

const FontAttributor = Quill.import('attributors/class/font');
FontAttributor.whitelist = [
  'Helvetica',
  'HelveticaMedium',
  'Arial',
  'TimesNewRoman',
  'Garamond',
  'PalatinoLinotype',
  'monospace',
  'sans-serif',
  'serif',
  'Georgia',
  'Cambria',
  'Calibri',
  'Verdana',
  'Corbel',
  'FranklinGothic'
];
Quill.register(FontAttributor, true);
const FontSize = Quill.import('attributors/class/size');
FontSize.whitelist = [
  '8px',
  '10px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '30px',
  '32px'
];


Quill.register(FontSize, true);

@Component({
  selector: 'app-custom-quill-editor',
  templateUrl: './custom-quill-editor.component.html',
  styleUrls: ['./custom-quill-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomQuillEditorComponent),
      multi: true
    }
  ]
})
export class CustomQuillEditorComponent implements ControlValueAccessor {
  @Input() noteText: string = "";
  value: string = '';
  @Input() editorPlaceholder: string = '';
  @Output() onEditorValueChange: EventEmitter<any> = new EventEmitter();
  noteModel: any = null;
  @ViewChild('editor') editor;
  quillConfig: any = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'color': ['red', 'black', '#021155', '#75787B', '#55565A', '#eee', 'green', 'orange', '#021155'] }, { 'background': ['red', 'black', '#021155', '#75787B', '#55565A', '#eee', 'green', 'orange', '#021155'] }],
      [{ 'align': [false, 'center', 'right', 'justify'] }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'font': ['Helvetica', 'HelveticaMedium', 'Arial', 'TimesNewRoman', 'Garamond', 'PalatinoLinotype', 'monospace', 'sans-serif', 'serif', 'Georgia', 'Cambria', 'Calibri', 'Verdana', 'Corbel', 'FranklinGothic'] }],
      [{ 'size': ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px', '32px'] }],
      ['link']
    ]
  }

  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
  ) {

  }
  private _onChange = (_: any) => { };
  private _onTouched = () => { };

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  onContentChanged = (event) => {
    this.value = event;
    this._onChange(event);
    this.onEditorValueChange.emit(event);
  }
  onFocus = () => {
  }
  onBlur = () => {
  }
  onSelectionChanged = (event) => {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  }

}
