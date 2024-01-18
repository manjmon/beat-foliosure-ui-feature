import { formatNumber } from '@angular/common';
import { NumberDecimalConst } from "src/app/common/constants";
export class ValuationCalclation {
  public static isPositiveNumber(num: number): boolean {
    return num !== null && num !== undefined && num >= 0;
  }

  public static roundOffCalculatedValue(num: number): string {
    return formatNumber(num, "en-US", NumberDecimalConst.multipleDecimal);
  }

  public static GetCalcuationSchemaForOverAll(name: string) {
    let schemaList = [{
      peers: "Mean",
      ticker: "",
      cssClass: "over-all-mean",
    },
    {
      peers: "Median",
      ticker: "",
      cssClass: "over-all-median",
    }
    ];
    return schemaList.find(x => x.peers == name);
  }

  public static GetCalcuationSchemaTransactionForOverAll(name: string) {
    let schemaList = [{
      TargetName: "Mean",
      sector: "",
      cssClass: "over-all-mean",
    },
    {
      TargetName: "Median",
      sector: "",
      cssClass: "over-all-median",
    }
    ];
    return schemaList.find(x => x.TargetName == name);
  }

  public static GetCalcuationSchema(name: string) {
    let schemaList = [{
      data: {
        name: "Mean",
        peers: "",
        ticker: "",
        cssClass: "sector-mean",
      }
    },
    {
      data: {
        name: "Median",
        peers: "",
        ticker: "",
        cssClass: "sector-median",
      }
    }
    ];
    return schemaList.find(x => x.data.name == name);
  }

  public static GetCalucuationSchemaTransaction(name: string) {
    let schemaList = [{
      data: {
        name: "Mean",
        TargetName: '',
        sector: '',
        cssClass: "sector-mean",
      }
    },
    {
      data: {
        name: "Median",
        TargetName: '',
        sector: '',
        cssClass: "sector-median",
      }
    }
    ];
    return schemaList.find(x => x.data.name == name);
  }

  public static AllCompsSector = {
    data: {
      name: "All Comps",
      isActive: true,
      isHeader: true,
      cssClass: "over-all",
    },
    children: [
      {
        data: {
          name: "Mean - Overall",
          peers: "",
          ticker: "",
          cssClass: "over-all-mean",
        },
      },
      {
        data: {
          name: "Median - Overall",
          peers: "",
          ticker: "",
          cssClass: "over-all-median",
        },
      },
    ],
  };

  public static AllCompsSectorTrans = {
    data: {
      name: "All Comps",
      isActive: true,
      isHeader: true,
      cssClass: "over-all",
    },
    children: [
      {
        data: {
          name: "Mean - Overall",
          TargetName: "",
          sector: "",
          cssClass: "over-all-mean",
        },
      },
      {
        data: {
          name: "Median - Overall",
          TargetName: "",
          sector: "",
          cssClass: "over-all-median",
        },
      },
    ],
  }

  public static setImpliedERowWithoutSector(name: string, element: any) {
    switch (name) {
      case 'Mean':
        element['title'] = 'Mean - Overall';
        break;
      case 'Median':
        element['title'] = 'Median - Overall';
        break;
      default:
        break;
    }
  }

  public static setImpliedERowSector(name: string, element: any) {
    switch (name) {
      case 'Mean - Overall':
        element['title'] = 'Mean - Overall';
        break;
      case 'Median - Overall':
        element['title'] = 'Median - Overall';
        break;
      default:
        break;
    }
  }

  public static getfinancialkpi = [
    {
      kpiName: "EV/Revenue", financial: "Revenue", ImpliedEvMeanName:"Implied EV (Mean)",ImpliedEvMedianName:"Implied EV (Median)", moduleId: 7,ImpliedEvCal:"Company Equity Calculation Details",CompanyValue:"Company Equity Value",titlevalue:"Sum of (Implied EV + Company Equity Calculation Details)",fundownershipev:"(Fund Ownership x Company Equity Value)"
    },
    {
      kpiName: "EV/EBITDA", financial: "EBITDA",ImpliedEvMeanName:"Implied EV (Mean)",ImpliedEvMedianName:"Implied EV (Median)", moduleId: 7,ImpliedEvCal:"Company Equity Calculation Details",CompanyValue:"Company Equity Value",titlevalue:"Sum of (Implied EV + Company Equity Calculation Details)",fundownershipev:"(Fund Ownership x Company Equity Value)"
    },
    {
      kpiName: "EV/EBITA", financial: "EBITA",ImpliedEvMeanName:"Implied EV (Mean)",ImpliedEvMedianName:"Implied EV (Median)", moduleId: 7,ImpliedEvCal:"Company Equity Calculation Details",CompanyValue:"Company Equity Value",titlevalue:"Sum of (Implied EV + Company Equity Calculation Details)",fundownershipev:"(Fund Ownership x Company Equity Value)"
    },
    {
      kpiName: "EV/EBIT", financial: "EBIT",ImpliedEvMeanName:"Implied EV (Mean)",ImpliedEvMedianName:"Implied EV (Median)", moduleId: 7,ImpliedEvCal:"Company Equity Calculation Details",CompanyValue:"Company Equity Value",titlevalue:"Sum of (Implied EV + Company Equity Calculation Details)",fundownershipev:"(Fund Ownership x Company Equity Value)"
    },
    {
      kpiName: "EV/EBT", financial: "EBT",ImpliedEvMeanName:"Implied EV (Mean)",ImpliedEvMedianName:"Implied EV (Median)", moduleId: 7,ImpliedEvCal:"Company Equity Calculation Details",CompanyValue:"Company Equity Value",titlevalue:"Sum of (Implied EV + Company Equity Calculation Details)",fundownershipev:"(Fund Ownership x Company Equity Value)"
    },
    {
      kpiName: "P/CF", financial: "CF",ImpliedEvMeanName:"Implied Equity (Mean)",ImpliedEvMedianName:"Implied Equity (Median)", moduleId: 9,ImpliedEvCal:"Implied EV Calculation Details",CompanyValue:"Implied EV Value",titlevalue:"Sum of (Implied Equity + Implied EV Calculation Details)",fundownershipev:"(Fund Ownership x Attribute Value)"
    },
    {
      kpiName: "P/E", financial: "Net Income",ImpliedEvMeanName:"Implied Equity (Mean)",ImpliedEvMedianName:"Implied Equity (Median)", moduleId: 7,ImpliedEvCal:"Implied EV Calculation Details",CompanyValue:"Implied EV Value",titlevalue:"Sum of (Implied Equity + Implied EV Calculation Details)",fundownershipev:"(Fund Ownership x Attribute Value)"
    },
    {
      kpiName: "P/B", financial: "Book Value",ImpliedEvMeanName:"Implied Equity (Mean)",ImpliedEvMedianName:"Implied Equity (Median)", moduleId: 8,ImpliedEvCal:"Implied EV Calculation Details",CompanyValue:"Implied EV Value",titlevalue:"Sum of (Implied Equity + Implied EV Calculation Details)",fundownershipev:"(Fund Ownership x Attribute Value)"
    }
  ];

  public static prepareAsOnMonth(quarterAndYear: any, period: string){
    if(quarterAndYear === undefined || quarterAndYear === ''){
      return '';
    }
    let qAndYear = quarterAndYear.split(" ").map((item: string) => item.trim());
    if(period === "NTM"){
      qAndYear[1] = parseInt(qAndYear[1]) + 1;
    }
    if(qAndYear.length > 1){
      switch (qAndYear[0]) {
        case "Q1":
          return "Mar " + qAndYear[1];
        case "Q2":
          return "Jun " + qAndYear[1];
        case "Q3":
          return "Sep " + qAndYear[1];
        case "Q4":
          return "Dec " + qAndYear[1];
        default:
          return '';
      }
    }
  }
}