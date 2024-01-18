import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'companyFilter',
    pure: false
})
export class InternalReportCompanyFilter implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || filter == null) {
            return items;
        }
        let result = items?.filter(item => filter?.some(x=>x == item.portfolioCompanyID?.toString()));
        let isSelected = result?.filter(x=>x.editable);
        if(isSelected?.length == 0 && result.length > 0)
        {
            result[0]["editable"]=true;
        }
        return result;
    }
}