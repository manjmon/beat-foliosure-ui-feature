import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateFile'
})
export class TruncateFilePipe implements PipeTransform {

  transform(fileName: string, maxLength:number): any {
    fileName = fileName.trim();
    if (fileName.length <= maxLength) {
      return fileName;
    } else {
      const shortFilename = fileName.slice(0, maxLength - 5); // Leave space for "...."
      const extension = fileName.split('.').pop();
      return `${shortFilename}...${extension}`;
    }
  }

}