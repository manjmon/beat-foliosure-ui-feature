import { Component,  Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TreeNode } from '../../../interface/interface';
import { NumberDecimalConst } from "src/app/common/constants";
import { ValuationModelService } from "../../../../../services/valuation-model.service";
import { isNumeric } from '@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric';
import { FinancialValueUnitsEnum } from 'src/app/services/miscellaneous.service';

@Component({
  selector: 'app-financial-data',
  templateUrl: './financial-data.component.html',
  styleUrls: ['./financial-data.component.scss']
})
export class FinancialDataComponent implements  OnChanges {
  @Input() fundDetails: any;
  @Input() companyDetails: any;
  @Input() QuarterAndYear: any;
  @Output() emptyMarketData = new EventEmitter();
  @Input() rawData: any;
  marketData: TreeNode[];
  NumberDecimalConst = NumberDecimalConst;
  isWithSector: boolean = false;
  isLoading: boolean = true;
  ColumsWithoutSector: any = [];
  currencyUnit = FinancialValueUnitsEnum.Thousands;
  frozenCols: any = [{ field: 'peers', header: 'Peers' },
  { field: 'ticker', header: 'Ticker' }];
  dataCollection: any = []
  constructor(private _valuationService: ValuationModelService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes["rawData"]) {
      this.isLoading = true;
      if (this.rawData.length > 0 && this.rawData[0].FinancialData.FinancialData != null) {                
        this.financialDataValidator(this.rawData)
      } else {       
        this.isLoading = false;
      }
    }
  }

  setActive(marketData: any) {
    if (marketData.expanded) marketData.expanded = false;
    else marketData.expanded = true;
  }


  financialDataValidator(data: any) {
    let dublicateHeader = {}
    let self = this;
    let tempData = []
    data.forEach((val: any, key: any) => {
    let createNewObj = {};
    let arrayData = {data:{},children:[]};

      if (val.PeerDetail.Sector === "") {
        createNewObj['peers'] = val.PeerDetail.Peers
        createNewObj['ticker'] = val.PeerDetail.Ticker
        this.isWithSector = false;
      } else {
        arrayData = {
          data: {
            name: val.PeerDetail.Sector,
            isActive: false,
            isHeader: true,
          },
          children: [{
            data: {
              name: val.PeerDetail.Peers,
              peers: val.PeerDetail.Peers,
              ticker: val.PeerDetail.Ticker
            }
          }]
          
        }
        this.isWithSector = true;
      }

      val.FinancialData.FinancialData.forEach((kpi: any) => {
        kpi.KpiData.forEach((innerList: any) => {
          const headerField = `${kpi.KpiName} - ${innerList.PeriodName}`
          if (!dublicateHeader[headerField]) {
            dublicateHeader[headerField] = headerField
            self.ColumsWithoutSector.push({
              field: headerField,
              header: headerField
            })
          }
          if (val.PeerDetail.Sector === "") {
            createNewObj[headerField] = self.convertKpiValue(innerList.KpiValue, self.currencyUnit);
          } else {
            arrayData.children[0].data[headerField] = self.convertKpiValue(innerList.KpiValue, self.currencyUnit);
          }
        });
      });
      self.dataCollection.push(createNewObj)
      tempData.push(arrayData)
    });
    if (this.isWithSector) { this.arrangeParentChildData(tempData); }
    this.isLoading = false;
  }

  arrangeParentChildData(data: any) {
    for ( let i = 0; i < data.length; i++) {
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

    this.dataCollection = data;
    this.dataCollection[0].expanded = true;
    this.dataCollection[0].data.expanded = true;
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