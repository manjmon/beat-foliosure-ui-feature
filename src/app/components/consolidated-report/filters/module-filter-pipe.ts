import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'moduleFilter',
    pure: false
})
export class ConsolidatedReportModuleFilter implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || filter == null) {
            return items;
        }
        return items?.filter(item => filter?.some(x=> x.subPageId == item.subPageId && x.moduleID ==0) || filter?.some(x=> x.moduleID == item.moduleID && x.subPageId ==0));
    }
}