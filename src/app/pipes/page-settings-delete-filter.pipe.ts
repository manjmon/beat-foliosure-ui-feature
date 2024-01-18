import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pageSettingIsDelete',
    pure: false
})
export class PageSettingsDeletePipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }
        return items.filter(item => item.isDeleted==filter.isDeleted);
    }
}