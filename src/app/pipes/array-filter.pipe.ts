import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'arrayFilter'
})
export class ArrayFilterPipe implements PipeTransform {
    transform(items: any[], callback: (list: any[], item) => boolean, item ): any {
        if (!items || !callback) {
            return items;
        }
        return callback(items, item);
    }
}

