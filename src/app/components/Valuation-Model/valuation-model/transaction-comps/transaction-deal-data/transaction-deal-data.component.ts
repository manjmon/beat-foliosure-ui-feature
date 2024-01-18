import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges
  } from "@angular/core";
  import { TreeNode } from "../../../interface/interface";
  import { NumberDecimalConst } from "src/app/common/constants";
  import { isNumeric } from '@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric';
  import { FinancialValueUnitsEnum } from 'src/app/services/miscellaneous.service';
  import { DatePipe } from '@angular/common';

  @Component({
    selector: "app-transaction-deal-data",
    templateUrl: "./transaction-deal-data.component.html",
    styleUrls: ["./transaction-deal-data.component.scss"],
    providers: [DatePipe]
  })
  export class TransactionDealDataComponent implements OnInit, OnChanges {
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
    textaligncols: any = [
      { field: "equityvalue", header: "Equity Value" },
      { field: "ev", header: "EV" }
    ]
    scrollableCols: any = [
      { field: "acquirername", header: "Acquirer Name"},
      { field: "country", header: "Country"},
      { field: "dealcurrency", header: "Deal Currency"},  
    ];

    ColumsWithoutSector: any = [
        { field: "acquirername", header: "Acquirer Name"},
        { field: "country", header: "Country"},
        { field: "dealcurrency", header: "Deal Currency"},
        { field: "equityvalue", header: "Equity Value" },
        { field: "ev", header: "EV" } ,
    ];
    frozenCols: any = [
        { field: 'name', header: 'Target Name' },
        { field: "announcementdate", header: "Announcement Date"}
    ];
  
    constructor( private datePipe: DatePipe) {}
    
    ngOnChanges(changes: SimpleChanges){
      if(changes["rawData"])
      {
        this.formatData(this.rawData);
      }
    }
  
    ngOnInit(): void {
      this.scrollableCols.push(...this.textaligncols)
    }
  
    formatData(marketData: any) {
      let result = marketData;
      let temp = [];
      if (result.length > 0) {
        result.forEach((x) => {
          if (x.PeerDetail.PeerSet === "") {
            let item = {
              name: x.PeerDetail.TargetName,
              announcementdate:this.datePipe.transform(x.PeerDetail?.AnnouncementDate, "MM/dd/yyyy"),
              equityvalue: this.convertKpiValue(x.DealData?.EquityValue, this.currencyUnit) ,
              acquirername: x.PeerDetail?.Acqurier,
              country: x.PeerDetail?.Country,
              dealcurrency:x.PeerDetail?.DealCurrency,
              ev: this.convertKpiValue(x.DealData?.EV, this.currencyUnit)
            };
            temp.push(item);
            this.isWithSector = false;
          } else {
            let arr = {
              
              data: {
             name: x.PeerDetail.PeerSet,
             isHeader: true,
             expanded: false,
              },
              children: [
                {
                  data: {
                    name: x.PeerDetail.TargetName,
                    dealcurrency: x.PeerDetail.DealCurrency,
                    announcementdate: this.datePipe.transform(x.PeerDetail?.AnnouncementDate, "MM/dd/yyyy"),
                    equityvalue: this.convertKpiValue(x.DealData?.EquityValue, this.currencyUnit),
                    acquirername: x.PeerDetail?.Acqurier,
                    country: x.PeerDetail?.Country,
                    ev: this.convertKpiValue(x.DealData?.EV, this.currencyUnit)
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
    isStaticColumnHeader(val : any){
    const staticFields = this.textaligncols.map(x=>x.field);
     return staticFields.indexOf(val) == -1;
    }
  }