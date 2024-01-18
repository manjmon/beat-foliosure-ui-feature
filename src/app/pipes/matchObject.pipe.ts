import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'matchObject'
})
export class MatchObjectPipe implements PipeTransform {
    /// This is the `transform` method. It takes three arguments: the input value, the args, and the returnProperty.
    transform(value: any, args?: any, returnProperty?: string, filterProperty?: string): any {
        // This checks if the value and args are not null or undefined.
        if (value.length > 0 && args) {
            // This finds the object in the value array that matches the args.
            const matchedObject = value.find((object) => object[filterProperty].toLowerCase() === args.toLowerCase());
            // This returns the value of the matched object, or undefined if the object is not found.
            return matchedObject[returnProperty];
        }
        // This returns the original value if the args are not provided.
        return args;
    }
}