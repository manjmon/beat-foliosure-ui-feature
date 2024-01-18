import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'moduleFilter',
    pure: false
})
export class InternalReportModuleFilter implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || filter == null) {
            return items;
        }
        return items?.filter(item => filter?.split(',')?.some(x=>x==item.moduleId));
    }
}