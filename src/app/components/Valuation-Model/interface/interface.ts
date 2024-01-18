export interface ValuationModel {
    valuationCategoryId:number;
    fundId:number;
    fundName:string;
    companyId:number;  
    companyName:string;    
    companyCurrency:number;
    currencyId:number;
    quarter:number;
    year:number;
};

export interface TreeNode {
    data?: any;
    children?: TreeNode[];
    leaf?: boolean;
    expanded?: boolean;
}

export interface ImpliedEvValue{
    id: number,
    dataType: string,
    periodName: string,
    year: number,
    value: string
}

export interface ImpliedEvFinalValue{
    title: string,
    values: ImpliedEvValue[]
}