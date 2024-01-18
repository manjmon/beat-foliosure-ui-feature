
export interface AdhocDownload {
    Guid: string;
    PortfolioCompanyId: number;
    PeriodType:string;
    Year:number;
    Month:number;
    Quarter:string;
    AdhocDataScroll: any;
}
export interface CalendarQuarterYearModel{
    Year:number;
    Month:number;
    Quarter:string;
}
export interface Header {
    Header: string;
    Field: string;
    IsBold: boolean;
    Cell: string;
}
export interface FirstColumn {
    Value: string;
    Cell: string;
}
export interface UnstructuredData {
    Guid: string;
    Id: number;
    SheetName: string;
    Headers: Header[];
    Rows: any[];
    FirstColumns: FirstColumn[];
}
export interface UnstructuredDataList {
    UnstructuredData: UnstructuredData[];
}

export interface AdhocDataScroll {
    Year:number;
    Month:number;
    MonthYear:string;
    Quarter:string;
    QuarterNo:number;
    PeriodType:string;
}
