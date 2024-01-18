import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {


  getstaticIconPath(name:string){
    switch(name){
      case "deleteicon": return "assets/dist/images/Delete Grey.svg";
      case "delete": return "assets/dist/images/delete.svg";
      case "uploadFile": return "assets/dist/images/uploadFiles.png";
      case "warning": return "assets/dist/images/warning.svg";      
      case "image": return "assets/dist/images/Image.svg";
      case "acuitylogo": return "assets/dist/images/Acuity-logo.svg";
      case "fslogo": return "assets/dist/images/logo.svg";
      case "error": return "assets/dist/images/error.svg";
      case "pdf": return "assets/dist/images/Adobe-acrobat.svg";
      case "excel": return "assets/dist/images/Microsoft-excel.svg";
      case "word": return "assets/dist/images/Microsoft-word.svg";
      case "powerpoint": return "assets/dist/images/powerpoint.svg";
      case "file": return "assets/dist/images/File.svg";
      case "folder": return "assets/dist/images/Folder.svg";
      case "restore": return "assets/dist/images/restore.svg";
      case "recyclebin": return "assets/dist/images/RecycleBin.svg";
      default: return "assets/dist/images/File.svg";
    }
  }

  getIconFromFileName(name:string){
    let fileExtension = name.replace(/^.*\./, '');
    let type="";
    switch(fileExtension){
      case "jpeg":
      case "png":
      case "svg":
      case "jpg": type = "image";break;
      case "pdf": type = "pdf";break;
      case "xlsx":
      case "xls":type = "excel";break;
      case "doc":
      case "docx":type = "word";break;
      case "file":type = "file";break;
      default: type = "file";break;
    }
    return this.getstaticIconPath(type);
  }

  getFinancialKpiHeader(header){
    header = header.toString();
    if(header.indexOf('Actual') !== -1 || header.indexOf('Budget') !== -1 || header.indexOf('Forecast') !== -1 || header.indexOf('IC') !== -1){
      let index = header.indexOf(')');
      header = header.substring(index+1).trim();
    }
    return header;
  }

}
