import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { isNumeric } from '@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric';
import { KpiTypesConstants, KpiTypesPrefixConstants } from 'src/app/common/constants';
import { KPIDataService } from 'src/app/services/kpi-data.service';
export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}
@Component({
  selector: "app-kpi-formula-builder",
  templateUrl: "./kpi-formula-builder.component.html",
  styleUrls: ["./kpi-formula-builder.component.scss"],
})
export class KpiFormulaBuilderComponent implements OnInit, AfterViewInit {
  @Input() kpiModel = null;
  @Input() selectedFormulaKPIType: any = null;
  @Input() formulaKPITypes: any = null;
  kpiList = [];
  globalFilter: null;
  blockedTable: boolean = false;
  kpiHeaders = [{ field: "kpi", header: "KPI Name" }];
  activeKPI: any = null;
  @Output() OnClose: EventEmitter<any> = new EventEmitter();
  formulaModel: any = "";
  formulaKPIModel: any = "";
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  selectedFormulaType: any = null;
  kpiId: number = 0;
  kpiMappingId: number = 0;
  @Input() isMapping: boolean = false;
  @ViewChild('textArea') _textArea: ElementRef;
  @ViewChild('contentDivElement') _contentDivElement: ElementRef;
  @ViewChild('ulDropDown') _dropdown: ElementRef;
  @ViewChild('ulErrorDropDown') _errorDropdown: ElementRef;
  isDisplay: boolean = false;
  originalKPIList: any[] = [];
  kpiDropDownList: any[] = [];
  errorUlMessage: string = "Unknown Value:";
  isError: boolean = false;
  contentAreaElement: string = "";
  currentFocusElement: any = null;
  isDisabledBtn: boolean = true;
  @Input() companyId = "0";
  isLoader: boolean = false;
  kpiDynamicId:number = 0;
  constructor(
    private kpiService: KPIDataService,
    private toasterService: ToastrService,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) { }
  ngOnInit(): void {
    this.toasterService.overlayContainer = this.toastContainer;
    this.selectedFormulaType = this.selectedFormulaKPIType;
    this.getKpiList(this.selectedFormulaKPIType?.name);
    this.getTillCursor();
    this.getKpiFormula();
  }
  setExistingFormula() {
    let element = document.querySelector('#contentBox');
    if (this.kpiModel?.formula != null && this.kpiModel?.formula != "" && this.kpiModel.formula != "||||") {
      element.innerHTML = this.kpiModel.formulaKPIId;
      if (element.children.length > 0) {
        this.kpiDynamicId = element.children.length;
      }
      this.isDisabledBtn = false;
    } else {
      let para = this.createEmptyElement();
      element.appendChild(para);
      para.after(para);
    }
    this.currentFocusElement = element.lastChild;
    this.setFocus();
    this.setStatus();
  }
  setStatus() {
    let element = document.querySelector('#contentBox') as HTMLDivElement;
    if (element.innerText != "") {
      this.isDisabledBtn = false;
    }
    else {
      if (this.kpiModel?.mappingKpiId > 0 || this.kpiModel.formula != "")
        this.isDisabledBtn = false;
      else
        this.isDisabledBtn = true;
    }
  }
  GetSelectedKpiData($event: any) {
    this.selectedFormulaType = $event.value;
    this.getKpiList($event.value.name);
  }
  getKpiList(type: string) {
    this.isLoader = true;
    this.kpiService.getKPIsByType(type, this.companyId).subscribe({
      next: (result) => {
        if (result != null) {
          if (!this.isMapping){
            this.getKpiType();
          }
          else{
            this.kpiId = this.kpiModel?.kpiId;
            this.kpiMappingId =  this.kpiModel?.mappingKpiId;
          }
          this.kpiList = result.length > 0 ? result.filter((data: any) => data.kpiId !== this.kpiId) :[];
          this.kpiDropDownList = result;
          this.originalKPIList = result;
          this.blockedTable = false;
        } else {
          this.kpiList = [];
          this.kpiDropDownList = [];
          this.originalKPIList = [];
          this.blockedTable = false;
        }
        this.isLoader = false;
      },
      error: (error) => {
        this.blockedTable = false;
        this.isLoader = false;
      }
    });
  }
  getKpiFormula() {
    this.isLoader = true;
    if (this.kpiModel?.formula != undefined && this.kpiModel?.formula != null) {
      let formulaModel = {
        Formula: this.kpiModel.formula,
      };
      this.kpiService.GetKpiFormula(formulaModel).subscribe({
        next: (result) => {
          if (result != null) {
            this.kpiModel.formulaKPIId = result.value;
            this.setExistingFormula();
          }
          this.isLoader = false;
        },
        error: (error) => {
          this.blockedTable = false;
          this.isLoader = false;
        }
      });
    } else {
      this.setExistingFormula();
    }
  }
  setIsActive(rowData: any) {
    this.kpiList.forEach((row) => (row.isActive = false));
    rowData.isActive = true;
    this.activeKPI = rowData;
  }
  closePopUp(result) {
    this.OnClose.emit(result);
  }
  applyFormula(value: string) {
    this.createSymbol(value);
  }
  applyFormulaKPI(rowData: any) {
    if (rowData != undefined && rowData != null) {
      switch (this.selectedFormulaType?.name) {
        case KpiTypesConstants.INVESTMENT_KPI:
          this.createKPIButtons(`${KpiTypesPrefixConstants.INVESTMENT_KPI_PREFIX}${rowData.kpiId}`, rowData.kpi.replace(/  +/g, ' '));
          break;
        case KpiTypesConstants.COMPANY_KPI:
          this.createKPIButtons(`${KpiTypesPrefixConstants.COMPANY_KPI_PREFIX}${rowData.kpiId}`, rowData.kpi.replace(/  +/g, ' '));
          break;
        case KpiTypesConstants.OPERATIONAL_KPI:
          this.createKPIButtons(`${KpiTypesPrefixConstants.OPERATIONAL_KPI_PREFIX}${rowData.kpiId}`, rowData.kpi.replace(/  +/g, ' '));
          break;
        case KpiTypesConstants.IMPACT_KPI:
          this.createKPIButtons(`${KpiTypesPrefixConstants.IMPACT_KPI_PREFIX}${rowData.kpiId}`, rowData.kpi.replace(/  +/g, ' '));
          break;
        case KpiTypesConstants.TRADING_RECORDS:
          this.createKPIButtons(`${KpiTypesPrefixConstants.TRADING_RECORDS_PREFIX}${rowData.kpiId}`, rowData.kpi.replace(/  +/g, ' '));
          break;
        case KpiTypesConstants.CREDIT_KPI:
          this.createKPIButtons(`${KpiTypesPrefixConstants.CREDIT_KPI_PREFIX}${rowData.kpiId}`, rowData.kpi.replace(/  +/g, ' '));
          break;
        case KpiTypesConstants.PROFIT_LOSS_KPI:
          this.createKPIButtons(`${KpiTypesPrefixConstants.PROFIT_LOSS_KPI_PREFIX}${rowData.kpiId}`, rowData.kpi.replace(/  +/g, ' '));
          break;
        case KpiTypesConstants.BALANCE_SHEET_KPI:
          this.createKPIButtons(`${KpiTypesPrefixConstants.BALANCE_SHEET_KPI_PREFIX}${rowData.kpiId}`, rowData.kpi.replace(/  +/g, ' '));
          break;
        case KpiTypesConstants.CASHFLOW_KPI:
          this.createKPIButtons(`${KpiTypesPrefixConstants.CASHFLOW_KPI_PREFIX}${rowData.kpiId}`, rowData.kpi.replace(/  +/g, ' '));
          break;
        default:
          break;
      }
    }
  }
  clearFormula() {
    this.formulaModel = "";
    this.formulaKPIModel = "";
    this.isDisplay = false;
    this.isError = false;
    this.errorUlMessage = "";
    let element = this._contentDivElement?.nativeElement as HTMLDivElement;
    if(element!=undefined)
    {
      element.innerText = "";
      element.innerHTML = "";
      let para = this.createEmptyElement();
      element.appendChild(para);
      this.currentFocusElement = para;
    }
    this.setFocus();
    this.setStatus();
  }
  getKpiType() {
    switch (this.selectedFormulaKPIType?.name) {
      case KpiTypesConstants.INVESTMENT_KPI:
        {
          this.kpiId = this.kpiModel?.investmentKPIId;
          this.kpiMappingId = 0;
        }
        break;
      case KpiTypesConstants.COMPANY_KPI:
        {
          this.kpiId = this.kpiModel?.companywiseKPIID;
          this.kpiMappingId = 0;
        }
        break;
      case KpiTypesConstants.OPERATIONAL_KPI:
        {
          this.kpiId = this.kpiModel?.sectorwiseKPIID;
          this.kpiMappingId = 0;
        }
        break;
      case KpiTypesConstants.IMPACT_KPI:
        {
          this.kpiId = this.kpiModel?.impactKPIId;
          this.kpiMappingId = 0;
        }
        break;
      case KpiTypesConstants.TRADING_RECORDS:
      case KpiTypesConstants.CREDIT_KPI:
        {
          this.kpiId = this.kpiModel?.masterKpiID;
          this.kpiMappingId = 0;
        }
        break;
      case KpiTypesConstants.PROFIT_LOSS_KPI:
        {
          this.kpiId = this.kpiModel?.profitAndLossLineItemID;
          this.kpiMappingId = 0;
        }
        break;
      case KpiTypesConstants.BALANCE_SHEET_KPI:
        {
          this.kpiId = this.kpiModel?.balanceSheetLineItemID;
          this.kpiMappingId = 0;
        }
        break;
      case KpiTypesConstants.CASHFLOW_KPI:
        {
          this.kpiId = this.kpiModel?.cashFlowLineItemID;
          this.kpiMappingId = 0;
        }
        break;
      default:
        break;
    }
  }
  saveFormula() {
    this.isLoader = true;
    if (!this.isMapping)
      this.getKpiType();
    this.getFormulas();
    let formulaModel = {
      KpiId: this.kpiModel?.mappingKpiId>0 ? 0:this.kpiId,
      MappingId: !this.isMapping ? 0 : this.kpiModel.mappingKpiId,
      KpiType: this.selectedFormulaKPIType?.name,
      Formula: this.formulaModel,
      FormulaKpiId: null,
    };
    this.kpiService.UpdateFormulaByKPIId(formulaModel).subscribe({
      next: () => {
        this.isLoader = false;
        this.toasterService.success("KPI formula updated successfully", "", {
          positionClass: "toast-center-center",
        });
        this.closePopUp(formulaModel);
      },
      error: () => {
        this.toasterService.error("Unable to update formula!", "", {
          positionClass: "toast-center-center",
        });
        this.isLoader = false;
      }
    });
  }
  keyEvent($event) {
    if ($event.ctrlKey && $event.which === 90)
      $event.preventDefault();
  }
  validateFormula($event: any) {
    if ($event.code == "Enter")
      $event.preventDefault();
    const contentDiv = this._contentDivElement.nativeElement as HTMLDivElement;
    if (contentDiv.innerText == "") {
      this.clearFormula();
      return;
    }
    let word = this.getLastWordBeforeCursor();
    if ((word != '' && $event.code != "Backspace")) {
      if ($event.code != "NumpadDecimal" && $event.code !="Period")
        this.searchKPI(word);
      if (!isNumeric(word.trim()) && this.kpiDropDownList.length > 0 && $event.code != "NumpadDecimal" &&  $event.code !="Period")
        this.getPosition($event);
      else {
        let arraySymbol: number[] = [40, 41, 43, 45, 42, 37,38,39, 47, 46,107,18,187,16,123,106];
        let isExist = arraySymbol.filter(x => x == $event.keyCode);
        if ((isNumeric(word.trim()) || $event.code == "NumpadDecimal" || $event.code == "Period") && $event.code != "Tab"  && isExist.length==0 ) {
          this.createDigits(word.trim(), $event);
          this.isError = false;
          this.isDisplay = false;
          this.errorUlMessage = "";
        }
        else {
          let arraySymbol: number[] = [40, 41, 43, 45, 42, 37,38,39, 47, 46,107,18,56,187,16,123,106];
          let isExist = arraySymbol.filter(x => x == $event.keyCode);
          if (isExist.length == 0 && $event.code != "NumpadDecimal" && $event.code !="Period") {
            this.isError = true;
            this.errorUlMessage = word;
          }

        }
      }
    }
    else {
      let arraySymbol: number[] = [40, 41, 43, 45, 42, 37, 47, 46];
      let isExist = arraySymbol.filter(x => x == $event.keyCode);
      if (isExist.length > 0 ){
        this.kpiDropDownList = [];
        this.isError = false;
        this.errorUlMessage = "";
      }
    }
  }
  applyFormulaKPIElement($event) {
    if ($event.code == "Enter") {
      $event.preventDefault();
    }
    if ($event.target.innerText == "") {
      this.clearFormula();
      return;
    }
    let word = this.getLastWordBeforeCursor();
    if (word != '' && !isNumeric(word.trim()) && $event.code != "NumpadDecimal" && $event.code !="Period") {
      this.searchKPI(word);
      let menu: any = this._dropdown.nativeElement as HTMLDivElement;
      let errorMenu = this._errorDropdown.nativeElement as HTMLDivElement;
      if (this.kpiDropDownList.length > 0) {
        let element = $event.currentTarget as HTMLDivElement;
        let top = element.offsetTop;
        let left = element.offsetLeft;
        menu.style.top = (top > 380 ? 380 : top) + 5 + 'px';
        errorMenu.style.top = (top > 380 ? 380 : top) + 'px';
        menu.style.left = left + 5 + 'px';
        errorMenu.style.left = left + 'px';
      }
      else {
        if (isNumeric(word.trim())) {
          this.createDigits(word.trim(), $event);
          this.isError = false;
          this.isDisplay = false;
          this.errorUlMessage = "";
        }
        else {
          if ($event.code != "NumpadDecimal" && $event.code !="Period") {
            this.isError = true;
            this.errorUlMessage = word;
          }
        }
      }
    }
    else {
      this.kpiDropDownList = [];
      this.isError = false;
      this.errorUlMessage = "";
    }
  }
  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }
  @HostListener('paste', ['$event']) blockPAste(e: KeyboardEvent) {
    e.preventDefault();
  }
  setFormulaLogic($event: any) {
    let word = this.getLastWordBeforeCursor();
    if ($event.code == "Enter")
      $event.preventDefault();
    let arraySymbol: number[] = [40, 41, 43, 45, 42, 37, 47, 46];
    let isExist = arraySymbol.filter(x => x == $event.keyCode);
    if (isExist.length > 0 && $event.code != "NumpadDecimal" && $event.code !="Period") {
      this.createSymbol($event.key);
      this.setFocus();
      $event.preventDefault();
    }
    if ((($event.code == "NumpadDecimal" || $event.code =="Period") && $event.key == ".") || isNumeric($event.key.trim())) {
      this.createDigits(word, $event);
      this.isError = false;
      this.isDisplay = false;
      this.errorUlMessage = "";
    }

  }
  applyEvent($event) {
    if ($event.code == "Delete" || $event.code == "Backspace") {
      const contentDiv = this._contentDivElement.nativeElement as HTMLDivElement;
      if (contentDiv.innerText.trim() == "") {
        contentDiv.innerHTML = "";
        this.currentFocusElement = null;
        this.setDefaultPosition();
        this.setFocus();
      }
    }
  }
  getCaretPosition($event) {
    let el = document.getElementById("contentBox");
    this.getCaretCharacterOffsetWithin(el);
  }
  getCaretCharacterOffsetWithin(element) {
    let caretOffset = 0;
    let doc = element?.ownerDocument || element?.document;
    let win = doc?.defaultView || doc?.parentWindow;
    let sel;
    if (typeof win?.getSelection != "undefined") {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        let range = win.getSelection().getRangeAt(0);
        let preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel == doc?.selection) && sel?.type != "Control") {
      let textRange = sel?.createRange();
      let preCaretTextRange = doc?.body?.createTextRange();
      preCaretTextRange?.moveToElementText(element);
      preCaretTextRange?.setEndPoint("EndToEnd", textRange);
      caretOffset = preCaretTextRange?.text?.length;
    }
    return caretOffset;
  }
  selectedKPI(kpi: any) {
    this.isDisplay = false;
    this.applyFormulaKPI(kpi);
    this.setFocus();
    this.setListener();
  }
  searchKPI(word: string) {
    if (!isNumeric(word.trim())) {
      this.kpiDropDownList = this.originalKPIList.filter(x => x.kpi.toLowerCase().includes(word.toLowerCase()));
      if (this.kpiDropDownList.length > 0)
        this.isDisplay = true;
      else {
        let regex = /^[a-z0-9]+$/
        if(regex.test(word) && word != "x"){
          this.isDisplay = false;
          this.isError = true;
          this.errorUlMessage = this.errorUlMessage + " " + word;
        }
      }
    }
  }

  getTillCursor() {
    const contentDiv = this._contentDivElement?.nativeElement as HTMLDivElement;
    let fullVal = contentDiv?.innerText;
    let cursorPos = this.getCaretCharacterOffsetWithin(contentDiv);
    let tillCursor = fullVal?.substring(0, cursorPos);
    return tillCursor;
  }
  getLastWordBeforeCursor() {
    let tillCursor = this.getTillCursor();
    let pattern = /\sand\s|\sor\s|[^a-z0-9.+ ]|\n/gi;
    let parts = tillCursor?.split(pattern);
    if (pattern == undefined) {
      return tillCursor.split(" ").pop();
    }
    if (parts?.length>1)
      return parts[parts.length - 1].trim() != "" ? parts[parts.length - 1].trim() : parts[parts.length - 2].trim();
    else 
      return parts?.length > 0 ? parts[parts?.length - 1].trim() :'';
  }
  getLastElementBeforeCursor() {
    let tillCursor = this.getTillCursor();
    let pattern = /\sand\s|\sor\s|[^a-z0-9.+ ]|\n/gi;
    let parts = tillCursor?.split(pattern);
    if (pattern == undefined) {
      return tillCursor.split(" ").pop();
    }
    if (parts?.length>1)
      return parts[parts.length - 1].trim();
    return ''
  }

  createEmptyElement() {
    const element = document.createElement("div") as HTMLDivElement;
    element.contentEditable = "true";
    element.setAttribute('data-element', 'kpi-empty');
    element.classList.add('d-inline-block', 'element-empty');
    element.innerHTML = "&nbsp;&nbsp;";
    this.kpiDynamicId = this.kpiDynamicId+1;
    element.id = this.kpiDynamicId.toString();
    return element;
  }
  createDivElement(kpiIdString: string, kpi: string) {
    const element = document.createElement("div") as HTMLDivElement;
    element.contentEditable = "false";
    element.setAttribute('data-element', 'kpi');
    element.setAttribute('id', kpiIdString);
    element.setAttribute('data-attr', kpiIdString);
    element.setAttribute('title', kpi);
    element.classList.add('custom-formula-div', 'd-inline-block', 'mt-1', 'mb-1', 'pr-2', 'kpi-formula-btn');
    element.innerText = kpi;
    this.kpiDynamicId = this.kpiDynamicId+1;
    element.id = this.kpiDynamicId.toString();
    element.onclick = function ($event) {
    };
    return element;
  }
  createSymbolElement(symbol: string) {
    let updatedSymbol = symbol == '*' ? 'x' : symbol;
    const element = document.createElement("div") as HTMLDivElement;
    element.contentEditable = "false";
    element.setAttribute('data-element', 'kpi');
    element.setAttribute('data-attr', symbol);
    element.classList.add('text-center', 'custom-formula-div', 'mt-1', 'mb-1', 'pr-2', 'pl-2', 'd-inline-block', 'formula-symbol');
    element.innerText = updatedSymbol;
    this.kpiDynamicId = this.kpiDynamicId+1;
    element.id = this.kpiDynamicId.toString();
    element.onclick = function ($event) {
    };
    return element;
  }
  createDigitElement(value: string) {
    const element = document.createElement("div") as HTMLDivElement;
    element.contentEditable = "false";
    element.setAttribute('data-element', 'kpi');
    element.setAttribute('data-attr', value);
    element.classList.add('text-center', 'custom-formula-div', 'pr-2', 'pl-2', 'd-inline-block', 'number-only', 'testsssssss', 'mt-1', 'mb-1');
    element.innerText = value;
    this.kpiDynamicId = this.kpiDynamicId+1;
    element.id = this.kpiDynamicId.toString();
    element.onclick = function ($event) {
    };
    return element;
  }
  createKPIButtons(kpiIdString: string, kpi: string) {
    let button = '<div  data-element="kpi" contenteditable="false" (click)="setKPIElement($event)" class="custom-formula-div d-inline-block mt-1 mb-1 pr-2 kpi-formula-btn" id="' + kpiIdString + '" data-attr="' + kpiIdString + '" title="' + kpi + '">' + kpi + '</div>';
    const contentDiv = (this._contentDivElement.nativeElement as HTMLDivElement);
    const innerHtml = contentDiv.innerHTML;
    if (this.currentFocusElement == null || this.currentFocusElement == undefined)
      contentDiv.innerHTML = innerHtml + button;
    else {
      let insertElement;
       if(this.currentFocusElement?.nextElementSibling != undefined && this.currentFocusElement?.nextElementSibling != null && this.currentFocusElement?.nextElementSibling.attributes['data-element'].value == "kpi-empty"){
        insertElement = this.currentFocusElement?.nextElementSibling as HTMLDivElement;
      }else
      {
        insertElement = this.currentFocusElement as HTMLDivElement;
      }
      let para = this.createDivElement(kpiIdString, kpi);
      insertElement.after(para);
      let emptyElement = this.createEmptyElement();
      para.after(this.createEmptyElement());
      para.after(emptyElement);
      insertElement.innerText = "  ";
      this.currentFocusElement = emptyElement.nextElementSibling as HTMLDivElement;
    }
    this.clearText();
    this.setStatus();
    this.setFocus();
  }
  createSymbol(symbol: string) {
    let updatedSymbol = symbol == '*' ? 'x' : symbol;
    let button = '<div data-element="kpi" tabindex="0" contenteditable="false" (click)="setSymbolElement($event)" class="text-center custom-formula-div pr-2 pl-2 d-inline-block formula-symbol mt-1 mb-1" data-attr="' + symbol + '" title="' + symbol + '">' + updatedSymbol + '</div>';
    const contentDiv = (this._contentDivElement.nativeElement as HTMLDivElement);
    const innerHtml = contentDiv.innerHTML;
    if (this.currentFocusElement == null || this.currentFocusElement == undefined)
      contentDiv.innerHTML = innerHtml + button;
    else {
      let insertElement;
      if(this.currentFocusElement?.nextElementSibling  !=null && this.currentFocusElement?.nextElementSibling != undefined && this.currentFocusElement?.nextElementSibling.attributes['data-element'].value != undefined && this.currentFocusElement?.nextElementSibling.attributes['data-element'].value == "kpi-empty"){
        insertElement = this.currentFocusElement?.nextElementSibling as HTMLDivElement;
      }else
      {
        insertElement = this.currentFocusElement as HTMLDivElement;
      }
      let para = this.createSymbolElement(symbol);
      insertElement.after(para);
      let emptyElement = this.createEmptyElement();
      para.after(this.createEmptyElement());
      para.after(emptyElement);
      insertElement.innerText = "  ";
      this.currentFocusElement = emptyElement.nextElementSibling as HTMLDivElement;
    }
    this.clearText();
    this.setStatus();
    this.setFocus();
  }
  createDigits(value: string, $event: any) {
    let button = '';
    const contentDiv = this._contentDivElement.nativeElement as HTMLDivElement;
    let word = this.getLastWordBeforeCursor();
    if (word != "") {
      button = '<div data-element="kpi" tabindex="0" contenteditable="false" (click)="setSymbolElement($event)" class="text-center check11111111111111111111 custom-formula-div pr-2 pl-2 d-inline-block mt-1 mb-1" data-attr="' + word + $event.key + '" title="' + word + $event.key + '">' + word + $event.key + '</div>';
    } else {
      button = '<div data-element="kpi" tabindex="0" contenteditable="false" (click)="setSymbolElement($event)" class="text-center custom-formula-div pr-2 pl-2 d-inline-block mt-1 mb-1" data-attr="' + $event.key + '" title="' + $event.key + '">' + $event.key + '</div>';
    }
    if (((word != '' && isNumeric(word.trim())) || ($event.key == "." && word != '') || word==".") && word!='+' && word!='-' && word!='x' && word!='/' && word!='(' && word!=')') {
      if (contentDiv.children.length > 0) {
        for (let j = 0; j < contentDiv?.children.length; j++) {
          let isEmptyElement = contentDiv?.children[j].classList.contains("element-empty");
          let attributesValue = contentDiv?.children[j].attributes["data-attr"]?.value;
          if (isEmptyElement != undefined && isEmptyElement != null && attributesValue != undefined && attributesValue != null) {
            let previousElementId = document.getElementById(this.currentFocusElement?.id).previousElementSibling.id;
            let currentElementId;
            let islastElement = this.getLastElementBeforeCursor();
            if(islastElement != ""){
              currentElementId = previousElementId;
            }else{
              currentElementId = document.getElementById(previousElementId).previousElementSibling.id;
            }
            if ((attributesValue == word || (word == "." && $event.key == ".") ) && contentDiv?.children[j].id == currentElementId) { 
              contentDiv.children[j].remove();
              let insertElement = contentDiv.children[j - 1] as HTMLDivElement;
              let value = word + $event.key;
              let para = this.createDigitElement(value);
              insertElement.after(para);
              insertElement.innerText = "  ";
              this.currentFocusElement = contentDiv.children[j + 1] as HTMLDivElement;
            }
          }
        }
      }
    } else {
      let insertElement;
      if(this.currentFocusElement?.nextElementSibling != undefined  && this.currentFocusElement?.nextElementSibling != null && this.currentFocusElement?.nextElementSibling.attributes['data-element'].value == "kpi-empty"){
        insertElement = this.currentFocusElement?.nextElementSibling as HTMLDivElement;
      }else
      {
        if(this.currentFocusElement != null ){
          insertElement = this.currentFocusElement as HTMLDivElement;
        }else{
          let para = this.createEmptyElement();
          contentDiv.appendChild(para);
          para.after(para);
          insertElement = para as HTMLDivElement;
        }
      }
      let emptyElement = this.createEmptyElement();
      let val = $event.key=="."?"0"+$event.key:$event.key;
      let para = this.createDigitElement(val);
      insertElement.after(para);
      para.after(this.createEmptyElement());
      para.after(emptyElement);
      insertElement.innerText = "  ";
      this.currentFocusElement = emptyElement.nextElementSibling as HTMLDivElement;
    }
    const innerHtml = contentDiv.innerHTML;
    if (this.currentFocusElement == null || this.currentFocusElement == undefined) {
      contentDiv.innerHTML = innerHtml + button;
      this.currentFocusElement = button;
    }
    this.clearText();
    this.setFocus();
    this.setStatus();
  }
  ngAfterViewInit(): void {
    this.setFocus();
    this.setListener();
  }
  getPosition(event: any) {
    let rect = event.target.getBoundingClientRect();
    let left = event.clientX == undefined ? 0 : event.clientX - rect.left;
    let top = event.clientY == undefined ? 0 : event.clientY - rect.top;
  }
  getFormulas() {
    let formula = "";
    let element;

    element = this._contentDivElement?.nativeElement as HTMLDivElement;
    for (let i = 0; i < element?.children?.length; i++) {
      if (element?.children[i].classList.contains("element-empty")) {
        if(element?.children[i+1] != undefined && element?.children[i+1].classList.contains("element-empty")){
          element.children[i+1].remove();
        }
        element.children[i].remove();
      }
    }
    for (let i = 0; i < element?.children?.length; i++) {
      if (element?.children[i].attributes["data-attr"]?.value != undefined && element?.children[i].attributes["data-attr"]?.value != "" && element?.children[i].attributes["data-attr"]?.value != null) {
        let attributeValue = element?.children[i].attributes["data-attr"]?.value;
        let isFormalSymbol = element?.children[i].classList.contains("formula-symbol");
        let isNumerFormat = element?.children[i].classList.contains("number-only");
        if (i == element?.children?.length - 1 && isFormalSymbol && !isNumerFormat && attributeValue != "(" && attributeValue != ")") {

          element.children[i].remove();
        } else {
          let updatedSymbol = attributeValue == 'x' ? '*' : attributeValue;
          formula = formula + "^^" + updatedSymbol;
        }
      }
    }
    if(formula != "")
      this.formulaModel = formula.trim() + "||||" + element.innerText;
    this.formulaKPIModel = element?.innerHTML;
  }
  clearText() {
    let children = [];
    let elements = this._contentDivElement.nativeElement as HTMLDivElement;
    for (let i = 0; i < elements?.children?.length; i++) {
      if (elements?.children[i].attributes["data-element"]?.value == "kpi-empty") {
        elements.children[i].innerHTML = "\u00a0";
      }
      children.push(elements?.children[i]);
    }
    elements.innerHTML = '';
    children.forEach((item) => elements.appendChild(item));
  }

  @HostListener('click', ['$event']) onClick(event) {
    if (event?.target?.attributes["data-element"]?.value == "kpi-empty") {
      this.currentFocusElement = event.target;
      this.applyFormulaKPIElement(event);
    }else if(event?.target?.attributes["data-element"]?.value == "kpi"){
      this.currentFocusElement = event.target.nextElementSibling;
      this.setFocus();
    }else{
      if(event.target.id == "contentBox" ){
        const contentDiv = (this._contentDivElement.nativeElement as HTMLDivElement);
        this.currentFocusElement = contentDiv.lastElementChild;
         this.setFocus();
      }
    }
  }
  @HostListener('keyup', ['$event']) onKeyUp(event) {
    if (event?.target?.attributes["data-element"]?.value == "kpi-empty") {
      this.currentFocusElement = event.target;
      this.applyFormulaKPIElement(event);
    }
  }
  @HostListener('keypress', ['$event']) onKeyPress(event) {
    if (event?.target?.attributes["data-element"]?.value == "kpi-empty") {
      this.currentFocusElement = event.target;
      this.applyFormulaKPIElement(event);
    }
  }
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    if (event?.target?.attributes["data-element"]?.value == "kpi-empty") {
      this.currentFocusElement = event.target;
      this.applyFormulaKPIElement(event);
    }
  }
  @HostListener('window:keyup', ['$event'])
  keyEvent1(event: any) {
    if (event?.target?.attributes["data-element"]?.value == "kpi-empty") {
      this.currentFocusElement = event.target;
    }
    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      let previousElementId = document.getElementById(this.currentFocusElement?.id)?.previousElementSibling?.id;
      if(document?.getElementById(this.currentFocusElement?.id).previousElementSibling?.attributes["data-element"]?.value != "kpi-empty"){
        this.currentFocusElement = document?.getElementById(previousElementId)?.previousElementSibling;
      }else{
        this.currentFocusElement = document?.getElementById(this.currentFocusElement?.id)?.previousElementSibling;
      }
      this.setFocus();
    }
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      let previousElementId = document?.getElementById(this.currentFocusElement?.id).nextElementSibling?.id;
      if(document?.getElementById(this.currentFocusElement?.id).nextElementSibling?.attributes["data-element"]?.value != "kpi-empty"){
        this.currentFocusElement = document?.getElementById(previousElementId)?.nextElementSibling;
      }else{
        this.currentFocusElement = document?.getElementById(this.currentFocusElement?.id)?.nextElementSibling;
      }
      this.setFocus();
    }
  }
  setListener() {
    const elements = document.querySelectorAll('.element-empty');
    let menu: any = this._dropdown?.nativeElement as HTMLDivElement;
    let errorMenu = this._errorDropdown?.nativeElement as HTMLDivElement;
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', function (event) {
        let element = event.currentTarget as HTMLDivElement;
        let top = element.offsetTop;
        let left = element.offsetLeft;
        menu.style.top = (top > 380 ? 380 : top) + 5 + 'px';
        errorMenu.style.top = (top > 380 ? 380 : top) + 'px';
        menu.style.left = left + 5 + 'px';
        errorMenu.style.left = left + 'px';
      });
      elements[i].addEventListener('keypress', function (event) {
        let element = event.currentTarget as HTMLDivElement;
        let top = element.offsetTop;
        let left = element.offsetLeft;
        menu.style.top = (top > 380 ? 380 : top) + 5 + 'px';
        errorMenu.style.top = (top > 380 ? 380 : top) + 'px';
        menu.style.left = left + 5 + 'px';
        errorMenu.style.left = left + 'px';
      });
      elements[i].addEventListener('mouseover', function (event) {
        let element = event.currentTarget as HTMLDivElement;
        let top = element.offsetTop;
        let left = element.offsetLeft;
        menu.style.top = (top > 380 ? 380 : top) + 5 + 'px';
        errorMenu.style.top = (top > 380 ? 380 : top) + 'px';
        menu.style.left = left + 5 + 'px';
        errorMenu.style.left = left + 'px';
      });
      elements[i].addEventListener('mousedown', function (event) {
        let element = event.currentTarget as HTMLDivElement;
        let top = element.offsetTop;
        let left = element.offsetLeft;
        menu.style.top = (top > 380 ? 380 : top) + 5 + 'px';
        errorMenu.style.top = (top > 380 ? 380 : top) + 'px';
        menu.style.left = left + 5 + 'px';
        errorMenu.style.left = left + 'px';
      });
    }
  }
  setDefaultPosition() {
    let menu: any = this._dropdown.nativeElement as HTMLDivElement;
    let errorMenu = this._errorDropdown.nativeElement as HTMLDivElement;
    menu.style.top = '40px';
    errorMenu.style.top = '40px';
    menu.style.left = '40px';
    errorMenu.style.left = '40px';
  }
  setFocus() {
    const contentDiv = document.querySelector("#contentBox") as HTMLDivElement;
    let childElement = contentDiv.lastElementChild as HTMLDivElement;
    if (contentDiv?.children?.length > 0) {
      if (this.currentFocusElement != undefined && this.currentFocusElement != null) {
        let element = contentDiv;
        let currentFocus = this.currentFocusElement as HTMLDivElement;
        for (let i = 0; i < element?.children?.length; i++) {
          if (element.children[i] === currentFocus) {
            let currentelement = element.children[i] as HTMLDivElement;
            currentelement.focus();
            let range = document.createRange();
            let selection = window.getSelection();
            range.setStart(currentelement, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      } else {
        childElement?.focus();
        let range = document.createRange();
        let selection = window.getSelection();
        range.setStart(childElement, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        this.currentFocusElement = childElement;
      }
    }
    else {
      let para = this.createEmptyElement();
      contentDiv.appendChild(para);
      para.after(para);
      childElement = contentDiv.lastElementChild as HTMLDivElement;
      let range = document.createRange();
      let selection = window.getSelection();
      range.setStart(childElement, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      this.currentFocusElement = childElement;
    }
  }
  @HostListener("document:click") clicked() {
    this.isDisplay = false;
    this.isError = false;
    this.errorUlMessage = "";
  }
}