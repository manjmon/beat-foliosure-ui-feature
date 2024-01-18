import { Pipe, PipeTransform } from "@angular/core";
import { FundEnum } from "src/app/common/constants";
@Pipe({
    name: "TrueOrFalse"
})
export class FundReportTrueOrFalse implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        switch (value) {
            case FundEnum.StrategyDescription: case FundEnum.SWInvestmentValueChart: case FundEnum.SWTotalValueChart:
            case FundEnum.TrackRecord: case FundEnum.FPChart:
                return true
            case FundEnum.AttributionReportTable:
                return false;
                
            default:
                return false;
                
        }
    }
}