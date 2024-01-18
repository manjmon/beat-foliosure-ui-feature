export interface ItemDetails {
    order: number,
    name: string;
    id: number;
    oldcount: number;
    period: string;
    width: string;
    alignment: string;
    alignmentLogo: string;
    kpiId: string;
    financialKpis: string;
    footnote:boolean;
  }
  export interface TemplateDetails {
    TemplateId:number;
    Template: string,
    Action: string,
    Selection: string,
    items: ItemDetails[];
  }