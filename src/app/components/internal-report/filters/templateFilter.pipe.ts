import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'templateFilter'
})
export class TemplateFilter implements PipeTransform {

  transform(items: any[], filter: any): any {
    if (!items || filter == null) {
        return items;
    }
    if(filter.name == 'Quarterly Template')
    {
      return items.filter(item=>item.calculationType!='FY' && item.calculationType!='LTM' && item.calculationType!='YTD' && item.calculationType!='MTD');
    }
    else if(filter.name == 'Monthly Template')
    {
      return items.filter(item=>item.calculationType!='%QoQ' && item.calculationType!='%MoM' && item.calculationType!='%YoY' && item.calculationType!='#Variance');
    }
    else{
      return items;
    }
}
}
