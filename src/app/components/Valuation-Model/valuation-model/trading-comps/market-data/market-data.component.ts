import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { TreeNode } from "../../../interface/interface";
import { NumberDecimalConst } from "src/app/common/constants";
import { isNumeric } from '@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric';
import { FinancialValueUnitsEnum } from 'src/app/services/miscellaneous.service';
@Component({
  selector: "app-market-data",
  templateUrl: "./market-data.component.html",
  styleUrls: ["./market-data.component.scss"],
})
export class MarketDataComponent implements  OnChanges {
  @Input() fundDetails: any;
  @Input() companyDetails: any;
  @Input() QuarterAndYear: any;
  @Input() isReload: boolean;
  @Input() rawData:any;
  marketData: TreeNode[];
  marketDataWithoutSectors: any[];
  NumberDecimalConst = NumberDecimalConst;
  isWithSector: boolean = true;
  isLoading: boolean = true;
  currencyUnit = FinancialValueUnitsEnum.Thousands;
  scrollableCols: any = [
    { field: "sharePrice", header: "Share Price" },
    { field: "marketCap", header: "Market Cap" },
    { field: "ev", header: "EV" },
  ];
  ColumsWithoutSector: any = [
    { field: "sharePrice", header: "Share Price" },
    { field: "marketCap", header: "Market Cap" },
    { field: "ev", header: "EV" },
  ];
  frozenCols: any = [
    { field: "peers", header: "Peers" },
    { field: "ticker", header: "Ticker" },
  ];  
  ngOnChanges(changes: SimpleChanges){
    if(changes["rawData"])
    {
      this.formatData(this.rawData);
    }
  }

  formatData(marketData: any) {
    let result = marketData;
    let temp = [];
    if (result.length > 0) {
      result.forEach((x) => {
        if (x.PeerDetail.Sector === "") {
          let item = {
            peers:x.PeerDetail.Peers,
            ticker: x.PeerDetail.Ticker,
            sharePrice: this.convertKpiValue(x.MarketData?.SharePrice, this.currencyUnit),
            marketCap: this.convertKpiValue(x.MarketData?.MarketCap, this.currencyUnit),
            ev: this.convertKpiValue(x.MarketData?.EV, this.currencyUnit),
          };
          temp.push(item);
          this.isWithSector = false;
        } else {
          let arr = {
            
            data: {
              name: x.PeerDetail.Sector,
              isHeader: true,
              expanded: false,
            },
            children: [
              {
                data: {
                  name: x.PeerDetail.Peers,
                  sector: x.PeerDetail.Sector,
                  ticker: x.PeerDetail.Ticker,
                  sharePrice: this.convertKpiValue(x.MarketData?.SharePrice, this.currencyUnit),
                  marketCap:  this.convertKpiValue(x.MarketData?.MarketCap, this.currencyUnit),
                  ev: this.convertKpiValue(x.MarketData?.EV, this.currencyUnit),
                },
              },
            ],
          };
          temp.push(arr);
          this.isWithSector = true;
        }
      });
    }
    if(this.isWithSector)
    {this.arrangeData(temp);}else{
      this.marketDataWithoutSectors = temp;
    }
    this.isLoading = false;
  }
  arrangeData(data: any) {
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        if (data[j].data.name === data[i].data.name) {
          Array.prototype.push.apply(data[i].children, data[j].children);
          data[j].children = [];
        }
      }
    }
    data = data.filter((x) => {
      return x.children.length > 0;
    });
    this.marketData = data;
    if(data.length > 0){
      this.marketData[0].expanded = true;
      this.marketData[0].data.expanded = true;
    }
    
  }
  setActive(marketData: any) {
    if (marketData.expanded) marketData.expanded = false;
    else marketData.expanded = true;
  }
  isNumberCheck(str: any) {
    return isNumeric(str);
  }
  convertKpiValue(kpiVal: any, currencyUnit: number) {
    if (kpiVal != "" && kpiVal != null) {

      switch (Number(currencyUnit)) {

        case FinancialValueUnitsEnum.Millions:
          if (kpiVal != 0) {
            kpiVal = !isNaN(parseFloat(kpiVal)) && isNumeric(kpiVal) ? (<number>kpiVal / 1000000) : kpiVal;
          }
          break;
        case FinancialValueUnitsEnum.Billions:
          if (kpiVal != 0) {
            kpiVal = !isNaN(parseFloat(kpiVal)) && isNumeric(kpiVal) ? (<number>kpiVal / 1000000000) : kpiVal;
          }
          break;
        default: {
          if (kpiVal != 0) {
            kpiVal = !isNaN(parseFloat(kpiVal)) && isNumeric(kpiVal) ? (<number>kpiVal / 1000) : kpiVal;
          }
          break;
        }
      }
    }
    return kpiVal;

  }
  isStaticCloumnHeader(val : any){
   const staticFields = this.frozenCols.map(x=>x.field);
   return staticFields.indexOf(val) == -1;
  }
}