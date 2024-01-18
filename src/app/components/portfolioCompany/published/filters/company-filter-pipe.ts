import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'companyFilter',
    pure: false
})
export class CompanyFilterPipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (items.length == 0 || filter.companyName == '') {
            return items;
        }
        return items.filter(item => item.companyName.toLowerCase().indexOf(filter.companyName.toLowerCase()) !== -1);
    }
}