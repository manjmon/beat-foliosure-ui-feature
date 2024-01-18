import { AppConfig } from "../../../common/models";

export class ConvertValueUnitreport {
    static appConfig: AppConfig;

    static toMillion(reportData: any): [] {
        let ReportData = reportData || [];
        ReportData.forEach(i => {
            if (i.Results && i.Results.length > 0) {
                i.Results.forEach(s => {
                    s["Total Value"] = (s["Total Value"] / ConvertValueUnitreport.appConfig.DefaultNumberSystem);
                    s["Capital Invested"] = (s["Capital Invested"] / ConvertValueUnitreport.appConfig.DefaultNumberSystem);
                    s["Realized Value"] = (s["Realized Value"] / ConvertValueUnitreport.appConfig.DefaultNumberSystem);
                    s["Unrealized Value"] = (s["Unrealized Value"] / ConvertValueUnitreport.appConfig.DefaultNumberSystem);
                    s["Current Invested Capital"] = (s["Current Invested Capital"] / ConvertValueUnitreport.appConfig.DefaultNumberSystem);
                    s["Current Realized Value"] = (s["Current Realized Value"] / ConvertValueUnitreport.appConfig.DefaultNumberSystem);
                    s["Current Unrealized Value"] = (s["Current Unrealized Value"] / ConvertValueUnitreport.appConfig.DefaultNumberSystem);
                    s["Gain/(Loss)"] = (s["Gain/(Loss)"] / ConvertValueUnitreport.appConfig.DefaultNumberSystem);
                    s["TVPI"] = s["TVPI"]?.toString()?.length == 0 ? null : s["TVPI"];
                });
                    i.FooterRow["Total Value"] = (i.FooterRow["Total Value"] / ConvertValueUnitreport.appConfig.DefaultNumberSystem);
                    i.FooterRow["Capital Invested"] = ( i.FooterRow["Capital Invested"] / ConvertValueUnitreport.appConfig.DefaultNumberSystem);                  
                    i.FooterRow["Realized Value"] = (i.FooterRow["Realized Value"] / ConvertValueUnitreport.appConfig.DefaultNumberSystem);
                    i.FooterRow["Unrealized Value"] = (i.FooterRow["Unrealized Value"] / ConvertValueUnitreport.appConfig.DefaultNumberSystem);                  
                    i.FooterRow["Current Invested Capital"] = (i.FooterRow["Current Invested Capital"] / ConvertValueUnitreport.appConfig.DefaultNumberSystem);
                    i.FooterRow["Current Realized Value"] = (i.FooterRow["Current Realized Value"] / ConvertValueUnitreport.appConfig.DefaultNumberSystem);
                    i.FooterRow["Current Unrealized Value"] = (i.FooterRow["Current Unrealized Value"] / ConvertValueUnitreport.appConfig.DefaultNumberSystem);
                    i.FooterRow["Gain/(Loss)"] = (i.FooterRow["Gain/(Loss)"] / ConvertValueUnitreport.appConfig.DefaultNumberSystem);
            }
        });
        return ReportData;
    }

}
