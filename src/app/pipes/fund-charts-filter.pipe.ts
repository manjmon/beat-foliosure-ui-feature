import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
    name: "ReturnChart"
})
export class FundChartFilter implements PipeTransform {
    transform(args: any): any {
        let count = 0;
        let label = "Select Charts";
        if (args != null) {
            args.forEach((element, index) => {
                if (element.isDisable) count++;
            });
            return count == 0 ? label : count + " Chart(s) Selected";
        }
        return "Select Charts";
    }
}