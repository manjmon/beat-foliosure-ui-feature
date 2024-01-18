export interface FundConfigurationdetails {
    order: number,
    featureid: number;
    period: string;
    width: string;
    alignment: string;
    config:string;
    featureName:string;
    nestedConfigFilters:FundConfigurationdetails[];
  }
  export interface FundReportTemplateDetails {
    FundTemplateId:number;
    Template: string,
    Action: string,
    Selection: string,
    UserId:number,
    ConfigList: FundConfigurationdetails[];
  }