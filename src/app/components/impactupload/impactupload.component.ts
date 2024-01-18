import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  OnInit,
  
  Input,
  Inject,
  
} from '@angular/core';
import { DocumentService } from "./../../services/document.service";
import { FirmService } from "src/app/services/firm.service";
import { FundService } from "src/app/services/funds.service";
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";
import { DealService } from "src/app/services/deal.service";
import {  ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
import { secureRandom  } from 'src/app/common/constants';
import { HelperService } from "src/app/services/helper.service";

@Component({
  selector: 'app-impactupload',
  templateUrl: './impactupload.component.html',
  styleUrls: ['./impactupload.component.scss'],
})
export class ImpactuploadComponent implements OnInit {
  config = {
    backdrop: false,
    ignoreBackdropClick: true,
    animated: false,
  };
  myAppUrl: string = "";
  interval: any = 0;
  failedFilesCount = 0;
  intervals = 1000;
  @Output() onInitEvent = new EventEmitter();
  @Input() compnayid;//:number = 1;
  @Input() year;//: number = 2020;
  @Input() qauter;//:string = "Q3";
  @ViewChild("fileDropRef") fileDropEl: ElementRef;
  files = [];
  value: number = 0;
  folder: string = "Impact";
  final: string = "Final";
  ProgressCancel: boolean = false;
  cancel: boolean = false;
  FileProgresStatus: string = "File Processing...";
  uploadedfiles = [];
  finaluploadedfiles=[];
  fileToBeDeleted = undefined;
  confirmDiscard: boolean = false;
  confirmDelete: boolean = false;
  base64: any;
  @Input() ispopup: boolean = true;
  constructor(
    private documentService: DocumentService,
    private helperService: HelperService,
    private firmService: FirmService,
    private fundService: FundService,
    private portfolioCompanyService: PortfolioCompanyService,
    private dealService: DealService,
    private toastrService: ToastrService,
    private http: HttpClient,
    @Inject("BASE_URL") baseUrl: string
  ) {
    this.myAppUrl = baseUrl;
  }

  ngOnInit() {

    this.getfiles();
    }

  timing() {
    let interval = setInterval(() => {
      this.value = this.value + Math.floor(secureRandom(10)) + 1;
      if (this.value >= 75) {
        this.value = 0;
        clearInterval(interval);
      }
    }, 2000);
  }

  changequateryare(year, quater) {
    this.qauter = quater;
    this.year = year;
    this.getfiles();
  }
  pickdata(data: any): void {
    this.onInitEvent.emit(data);
  }
  showtoasterOnuploadComplete(Msg: any, status) {
    if (status == "error")
      this.toastrService.warning(Msg);
    if (status == "success")
      this.toastrService.success(Msg);
  }
  impactupload(file) {
    const formData = new FormData();
    formData.append("file", file);
    let path = this.folder + "&" + this.compnayid + "&" + this.year + "&" + this.qauter;
    this.portfolioCompanyService.uploadlogos(formData, path).subscribe((res: any) => {
      this.getfiles();
    });
  }
  onFileDropped($event) {
    this.prepareFilesList($event);
  }
  prepareFilesList(files: any) {
    let allImages: Array<string> = ['png', 'jpg', 'jpeg', 'gif', 'tiff', 'bpg'];
    this.cancel = true;
    for (let item of files) {
      this.pickdata(true);
      let type = item.name.split('.')[1];

      if (allImages.toString().toLocaleLowerCase().indexOf(type.toString().toLocaleLowerCase()) === -1) {
        this.pickdata(false);
      } else {
        this.cancel = false;
        this.pickdata(true);
        item.imagePath = this.getFileIcons(item.name);
        item.displayName = item.name.substr(0, item.name.lastIndexOf("."));
        this.files.push(item);
        this.impactupload(item);
      }
    }
    this.cancel = false;
    this.pickdata(false);

  }
  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  NoOnCancel() {
    this.confirmDiscard = false;
    this.confirmDelete = false;

  }
  OnDeleteUploadedFile() {
    this.files = this.files.filter((x) => x.name !== this.fileToBeDeleted);
    let path = this.folder + "&" + this.compnayid + "&" + this.year + "&" + this.qauter + "&" + this.fileToBeDeleted;
    this.http.get(this.myAppUrl + "api/removeimpactfile/" + path).subscribe((Response: any) => {
      if (!Response) {
        this.ondeletefinal();
      }
      else this.getfiles();     
      this.confirmDelete = false;
    });
  }
  ondeletefinal() {
    let path =  this.compnayid + "&" + this.year + "&" + this.qauter + "&" + this.fileToBeDeleted;
    this.portfolioCompanyService.ondeletefinal( path).subscribe((Response: any) => {
      this.uploadedfiles = [];
      this.getfiles();
      this.confirmDelete = false;
    });
  }
  getfiles() {   
    this.uploadedfiles = [];
    let path = this.folder + "&" + this.compnayid + "&" + this.year + "&" + this.qauter;
    this.portfolioCompanyService.getuploadfiles(path).subscribe((Response: any) => {
     this.uploadedfiles=[];
      if (Response.length > 0) {
        Response.forEach(element => {
          let obj = <any>{}
          obj.key = element.key;
          obj.value = element.value;
          this.uploadedfiles.push(obj);
        });
       }
      this.finalfilesuploaded();
    });
  }
  finalfilesuploaded() {
    
    let path =  this.compnayid + "&" + this.year + "&" + this.qauter;
    this.portfolioCompanyService.getfinaluploadfiles(path).subscribe((Response: any) => {
      if (Response.length > 0) {
        this.finaluploadedfiles=[];
        Response.forEach(element => {
          let obj = <any>{}
          obj.key = element.key;
          obj.value = element.value;
          const found=this.uploadedfiles.some(x=>x.key===obj.key);
          if(!found){
          this.finaluploadedfiles.push(obj); }         
        });
        if(this.finaluploadedfiles.length>0){
        this.uploadedfiles.push(...this.finaluploadedfiles);}
      }
    });   
  }
  openDelete(file) {
    this.fileToBeDeleted = file;
    this.confirmDelete = true;
  }
  getpreviewimageurl(files: any) {
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = event => {
      return reader.result;
    };
  }
  getIcons(name: string) {
    return this.helperService.getstaticIconPath(name);
  }

  getFileIcons(filename: string) {
    return this.helperService.getIconFromFileName(filename);
  }

  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

}
