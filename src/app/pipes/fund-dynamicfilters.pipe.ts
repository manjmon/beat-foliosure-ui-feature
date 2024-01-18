import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
    name: "ReturnString"
})
export class FundDynamicFilter implements PipeTransform {
    label: string = "";
    transform(args: any): any {
        let count = 0;
        let Copyfilterstring = "";
        if (args != null) {

            ((args["attributionType"] != '' && args["attributionType"] != null) ? (this.label == "" ? Copyfilterstring = args["attributionType"].label : '') : '');
            ((args["strategies"] != '' && args["strategies"] != null) ? (this.label == "" ? Copyfilterstring = "Strategies" : '') : '');
            ((args["regions"] != '' && args["regions"] != null) ? (this.label == "" ? Copyfilterstring = "Regions" : '') : '');
            ((args["countries"] != '' && args["countries"] != null) ? (this.label == "" ? Copyfilterstring = "Countries" : '') : '');
            ((args["evaluationDate"] != '' && args["evaluationDate"] != null) ? (this.label == "" ? Copyfilterstring = "Evaluation Date" : '') : '');

            ((args["attributionType"] != '' && args["attributionType"] != null) && (count++));
            ((args["strategies"] != '' && args["strategies"] != null) && (count++));
            ((args["regions"] != '' && args["regions"] != null) && (count++));
            ((args["countries"] != '' && args["countries"] != null) && (count++));
            ((args["evaluationDate"] != '' && args["evaluationDate"] != null) && (count++));

            if (!Object.values(args).some(e => Boolean(e))) {
                Copyfilterstring = "";
                this.label = "";
            }
            if (this.label != "")
                Copyfilterstring = this.label;
            this.label = Copyfilterstring;
            let cnt = count - 1;
            if (cnt == 0)
                return this.label;
            else if (cnt == -1)
                return "Select filters";
            else
                return this.label + " +" + cnt;
        }
        return "Select filters";
    }
}