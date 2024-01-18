import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'groupFilter',
    pure: false
})
export class CompanyGroupFilter implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || filter == null || filter == "") {
            return items;
        }
        return items?.filter(item => item.groupName?.toLowerCase().includes(filter.toLowerCase()));
    }
}