import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'arrayFilterTrueOrFalse'
})
export class PageConfigArrayFilterTrueOrFalse implements PipeTransform {
    transform(items: any[], item): any {
        let hasMatch = items.filter(function (val) {
            return (val.subPageID === item.subPageID && val.fieldID == item.id);
        }).length > 0;
        return hasMatch
    }
}

