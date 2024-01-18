import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'trackrecordSymbol'
})
export class TrackrecordSymbol  implements PipeTransform {
    transform(items: any[], item): any {
        let hasMatch = items.filter(function (val) {
            return (val.subPageID === item.subPageID  &&val.displayName===item);
        });       
        if (hasMatch.length > 0) {
            const symbol = hasMatch[0].dataType; console.log(symbol)
            let finalsymbol = symbol == 4 ? "%" :
                symbol == 5 ? "x" : "";
            return finalsymbol
        }
        return 
    }
}
