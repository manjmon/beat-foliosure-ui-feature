import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pcArrayFilter'
})
export class PortfolioCustomListPipe implements PipeTransform {
    transform(items: any[], item): any {
        return items.filter(val =>val.fieldId == item.fieldID)
    }
}
