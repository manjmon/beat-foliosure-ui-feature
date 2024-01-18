import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  transform(value: any) {
    return new DOMParser().parseFromString(value, 'text/html').documentElement.textContent;
  }
}