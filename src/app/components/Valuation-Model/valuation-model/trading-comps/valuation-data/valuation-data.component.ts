  import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from "@angular/core";
import * as math from "mathjs";
import { TreeNode } from "../../../interface/interface";
import { NumberDecimalConst } from "src/app/common/constants";
import { ValuationCalclation } from "../../../shared/valuation-calculation";
import { ValuationModelService } from "../../../../../services/valuation-model.service";
import { isNumeric } from "@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric";
import { FinancialValueUnitsEnum } from "src/app/services/miscellaneous.service";
import { ImpliedEvService } from "src/app/services/implied-ev.service";

@Component({
  selector: "app-valuation-data",
  templateUrl: "./valuation-data.component.html",
  styleUrls: ["./valuation-data.component.scss"],
})
export class ValuationDataComponent implements OnInit, OnChanges {
  @Input() fundDetails: any;
  @Input() companyDetails: any;
  @Input() QuarterAndYear: any;
  @Output() emptyMarketData = new EventEmitter();
  @Input() rawData: any;
  @Input() selectedKPIDropdown: any;
  marketData: TreeNode[];
  NumberDecimalConst = NumberDecimalConst;
  isWithSector: boolean = false;
  isLoading: boolean = true;
  currencyUnit = FinancialValueUnitsEnum.Thousands;
  frozenCols: any = [{ field: "peers", header: "Peers" }];
  termsToCalculate: any = ["Mean", "Median"];
  ColumsWithoutSector: any = [];
  evOrMarketCap: any = "EV";
  dataCollection: any = [];
  masterArray: any = [];
  sectorList: any = [];
  rowHeader: any = [];
  valuationDataSource: any = [];
  dataTOSendForImpliedEV = [];
  dataSentToImpliedEv: boolean = false;
  dropDownKpi: any = [];
  kpiFirstName:string;
  kpiLastName:string;
  kpiData: any;
  valuationCalclation: typeof ValuationCalclation = ValuationCalclation;
  unSelectedRecords: {
    recordIds: any[],
    kpiId: number
  }[];
  checkBoxList: any[] = [];
  subscriptions:  any = [];
  constructor(private _valuationService: ValuationModelService, private _impliedEvService: ImpliedEvService) { }

  ngOnInit(): void {
    if (!this.dataSentToImpliedEv) {
      this.getImpliedEvData(this.dataTOSendForImpliedEV);
      this.dataSentToImpliedEv = true;
    }

    this.subscriptions.push( this._impliedEvService.getUnselectedRecords().subscribe(response => {
      this.unSelectedRecords =  response === null  ? [] : response;
    }));

    this.subscriptions.push( this._impliedEvService.getRefreshValuationComponent().subscribe(refresh => {
      if (refresh) {
        this.formatDataResponse(this.rawData);
        this.unSelectedRecords = this.unSelectedRecords.filter(us => us.kpiId !== this.selectedKPIDropdown?.kpiId);
        let mergeFlatArray = this.getRawValuationData();
        let unselectedData = mergeFlatArray.filter(x => !x.IsSelected);
        unselectedData.filter(dc => !dc.IsSelected).forEach(us => {
          this.manageSelectedRecordIds(us.Id);
        });
        this._impliedEvService.setUnselectedRecords(this.unSelectedRecords);
        this._impliedEvService.setRefreshValuationComponent(false);
      }
    }));
    
    this.subscriptions.push( this._impliedEvService.getClearCheckBoxListFlag().subscribe(flag => {
      this.clearCheckBoxList(flag);
    }));
  }

  ngOnDestroy(){
    // prevent memory leak when component destroyed
    let tempEVData = JSON.parse(localStorage.getItem("tempEVData"));
    if(this.checkBoxList.length > 0){
      let tempObj = Object.assign({},tempEVData, { checkBoxList : this.checkBoxList});
      localStorage.setItem("tempEVData", JSON.stringify(tempObj));
    }
    localStorage.removeItem("tempEquityValueData");
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  setKpiData(){
    let currentKpiData = this.rawData[0].ValuationData.find(x => x.KpiId === this.selectedKPIDropdown?.kpiId);
    this.kpiData = currentKpiData?.KpiData.map(item => {
      const { KpiValue, ...rest } = item;
      return rest;
    });
    this._impliedEvService.setKpiData(this.kpiData);
  }

  getImpliedEvData(data: any[]) {
    this._impliedEvService.setCopmValues(data);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["selectedKPIDropdown"]) {
      this.isLoading = true;
     
      const displayName = this.selectedKPIDropdown?.displayName;
      const firstPart = displayName?.split("/")[0];
      this.evOrMarketCap = firstPart === "EV" ? "EV" : "MarketCap";
      if (firstPart === "EV") {
        this.ColumsWithoutSector = [{ field: "EV", header: "EV" }];
      } else {
        this.ColumsWithoutSector = [
          { field: "MarketCap", header: "Market Cap" },
        ];
      }
      let usRecord = this.unSelectedRecords?.find(x => x.kpiId === this.selectedKPIDropdown?.kpiId)?.recordIds;
      if(usRecord?.length > 0){
        let mergeFlatArray = this.getRawValuationData();
        mergeFlatArray.forEach(mfa => {
          mfa.IsSelected = true;
          if(usRecord?.includes(mfa.Id)){
            mfa.IsSelected = false;
          }
        });
      }
      this.formatDataResponse(this.rawData);
    }
    this.setKpiData();
  }

  setActive(marketData: any) {
    marketData.expanded = marketData.expanded ? false : true;
  }

  filterDataBasedOnKpiName() {

    const groupBy = (array, key) => {
      return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
          currentValue
        );
        return result;
      }, {});
    };

    let filteredKpiData = this.valuationDataSource?.filter(item => item?.KpiName === this.selectedKPIDropdown?.displayName)
    this.isWithSector = filteredKpiData[0]?.Sector == "" ? false : true
    let formateDataFunction = groupBy(filteredKpiData, 'Sector')
    let columHeader = this.ColumsWithoutSector.filter(x => x.field != "EV" && x.field != "MarketCap")
    if (this.isWithSector) {
      this.sectorList = Object.keys(formateDataFunction);
      let res = this.sectorList.map((x, index) => (
        {
          data: { name: x, isActive: index == 0 ? true : false, expanded: index == 0 ? true : false, cssClass: '', isHeader: true },
          children: formateDataFunction[x].map(y => ({ data: y }))
        }));
      this.dataCollection = res;
      if (this.sectorList.length > 1) {
        this.addOverAllSectionForSector(this.dataCollection);
        this.calculationForSectorData(this.dataCollection, columHeader);
      }
      const sectorData = this.dataCollection.filter((x) => x.children.length > 0 && x.data.name !== "All Comps");
      this.addMeanAndMedianForEachSector(sectorData, columHeader);
      this.dataCollection[0].expanded = true;
      this.dataCollection[this.dataCollection.length - 1].expanded = true;
      this.dataCollection[0].data.expanded = true;
      this.dataCollection[this.dataCollection.length - 1].data.expanded = true;    
    }
     else {
      this.dataCollection = filteredKpiData;
      this.dataCollection.push(ValuationCalclation.GetCalcuationSchemaForOverAll("Mean"));
      this.dataCollection.push(ValuationCalclation.GetCalcuationSchemaForOverAll("Median"));
      this.calculationForWithoutSectorData(this.dataCollection, columHeader)
    }
    let inputImpliedEV = this.dataCollection;
    let kpiName=inputImpliedEV[0]?.KpiName!=null?inputImpliedEV[0]?.KpiName: inputImpliedEV[0]?.children[0]?.data?.KpiName;
   
    this.getSelectedKpiRenamePeriod(kpiName);

    const allCompsData = this.prepareDataForEmpliedEv(inputImpliedEV, this.isWithSector);
    if (allCompsData.length > 0) {
      this.dataSentToImpliedEv = true;
      this.getImpliedEvData(allCompsData);
    }
    this.isLoading = false;
  }
  getSelectedKpiRenamePeriod(kpiName:string)
  {
    let kpiPcf=this.valuationCalclation.getfinancialkpi[5].kpiName;
    let kpiPe=this.valuationCalclation.getfinancialkpi[6].kpiName;
    let kpiPb=this.valuationCalclation.getfinancialkpi[7].kpiName;
   let selectedKpiName=kpiName; 
    if(selectedKpiName!=kpiPcf && selectedKpiName!=kpiPe && selectedKpiName!=kpiPb)
    {      
     if(selectedKpiName !== undefined)
     {
      let period=selectedKpiName.split('/');  
      if(period !== undefined)
      {
       let FirstName=period[0].concat("/");
       let LastName=period[1];
        this.kpiFirstName=FirstName;
        this.kpiLastName=LastName;
      }   
     }   
    }
    else{
      this.kpiFirstName=null;
      this.kpiLastName=null;
    }  
  }
  prepareDataForEmpliedEv(dataSet: any, isWithSector: boolean) {
    if (isWithSector) {
      if (this.sectorList.length == 1) {
        let set = [];
        dataSet[0]
          .children
          .filter(child => this.termsToCalculate.includes(child.data.name))
          .forEach(element => {
            ValuationCalclation.setImpliedERowWithoutSector(element.data.name, element.data)
            set.push(element.data);
          });
        return set;
      }
      else {
        // Since there should be only one item with the name 'All Comps', get the first (and only) item from the result
        let set = [];
        dataSet
          .filter(item => item.data.name === "All Comps")[0]
          .children.filter(child => child.data.name === "Mean - Overall" || child.data.name === "Median - Overall")
          .forEach(element => {
            ValuationCalclation.setImpliedERowSector(element.data.name, element.data)
            set.push(element.data);
          });
        return set;
      }
    }
    else {
      let set = [];
      dataSet
        .filter(data => this.termsToCalculate.includes(data.peers))
        .forEach(element => {
          ValuationCalclation.setImpliedERowWithoutSector(element.peers, element)
          set.push(element);
        });
      return set;
    }
  }

  getRawValuationData(){
    let ValuationFilterData = this.rawData.map((x) => (x.ValuationData)).flat().filter(obj => obj.KpiName == this.selectedKPIDropdown?.displayName);
    return structuredClone(ValuationFilterData.flat());
  }

  formatDataResponse(data: any) {
    this.dataCollection = [];
    this.valuationDataSource = [];

    let mergeFlatArray = this.getRawValuationData();
    let tempEVData = JSON.parse(localStorage.getItem("tempEVData"));
    let checkBoxList = [];
    if(tempEVData != null || tempEVData != undefined){
      if(tempEVData.kpiId === this.selectedKPIDropdown?.kpiId){
        checkBoxList = tempEVData.checkBoxList;
        this.checkBoxList = tempEVData.checkBoxList;
      }
    }
    mergeFlatArray.forEach((kpi) => {
      let kpiDataArray = {}
      kpiDataArray = {
        "Id": kpi.Id,
        "IsSelected": kpi.IsSelected,
        "Sector": kpi.Sector,
        "name": kpi.Peers,
        "peers": kpi.Peers,
        "KpiId": kpi.KpiId,
        "KpiName": kpi.KpiName,
        "MarketCap": this.convertKpiValue(kpi.MarketCap, this.currencyUnit),
        "EV": this.convertKpiValue(kpi.EV, this.currencyUnit),
        "cssClass": ''
      }
      if(checkBoxList !== undefined && checkBoxList.length > 0){
        let chk = checkBoxList.find(c => c.id === kpi.Id);
        if(chk){
          kpiDataArray["IsSelected"] = chk.checked;
        }
      }
      kpi.KpiData.forEach((innerData) => {
        if(innerData.PeriodName != 'Current Period' && innerData.PeriodName != 'Prior Period'){
          const headerField = `${innerData.PeriodName}`;
          kpiDataArray[headerField] = innerData.KpiValue
          let findHeader = this.ColumsWithoutSector.filter(item => item.field == headerField);
          if (findHeader.length == 0) {
            this.ColumsWithoutSector.push({
              field: headerField,
              header: headerField,
            })
          }
        }
      });

      this.valuationDataSource.push(kpiDataArray);
    });
    this._impliedEvService.setHeaders(this.ColumsWithoutSector.filter(x => x.field !== 'MarketCap' && x.field !== 'EV'));
    this._impliedEvService.setColumsWithoutSector(this.ColumsWithoutSector.filter(x => x.field !== 'MarketCap' && x.field !== 'EV'));
    this.filterDataBasedOnKpiName();
  }

  addOverAllSectionForSector(tempData: any) {
    tempData.push(ValuationCalclation.AllCompsSector);
  }

  addOverAllSectionWithoutSector(dataCollection: any) {
    dataCollection.push(ValuationCalclation.GetCalcuationSchemaForOverAll("Mean"));
    dataCollection.push(ValuationCalclation.GetCalcuationSchemaForOverAll("Median"));
  }

  calculationForSectorData(tempData: any, headers: any[]) {
    tempData
      .filter((x) => x.data.name === "All Comps")
      .forEach((row: any) => {
        row.children.forEach((child) => {
          headers.forEach((columnName) => {
            let dataArr = [];
            let data = tempData.slice(0, -1).map((item) => item.children);
            data.forEach((ch) => {
              if (ch.length > 0)
                ch.filter((x) => x.data.IsSelected).map((item) => item.data[columnName.field]).forEach((value) => {
                  dataArr.push(value);
                });
            });
            dataArr = dataArr.filter((x) => {
              return ValuationCalclation.isPositiveNumber(x);
            });

            switch (child.data.name) {
              // calculation of mean
              case "Mean - Overall":
                child.data[columnName.field] = dataArr.length ? math.mean(dataArr) : "NA";
                break;
              // calculation of median
              case "Median - Overall":
                child.data[columnName.field] = dataArr.length ? math.median(dataArr) : "NA";
                break;
            }
          });
        });
      });
  }

  addMeanAndMedianForEachSector(sectorData: any, headers: any[]) {
    sectorData.forEach((row: any) => {
      if (!row.children.map(c => c.data.name).includes("Mean")) {
        row.children.push(ValuationCalclation.GetCalcuationSchema("Mean"));
        row.children.push(ValuationCalclation.GetCalcuationSchema("Median"));
      }
      let meanRow = row.children.find(obj => obj.data.name === 'Mean');
      let medianRow = row.children.find(obj => obj.data.name === 'Median');
      headers.forEach(columnName => {
        let data = row.children.slice(0, -2)
          .filter((x) => x.data.IsSelected && ValuationCalclation.isPositiveNumber(x.data[columnName.field]))
          .map((item) => item.data[columnName.field])
        meanRow.data[columnName.field] = data.length ? math.mean(data) : "NA";
        medianRow.data[columnName.field] = data.length ? math.median(data) : "NA";
      });
    });
  }
  calculationForWithoutSectorData(dataCollection: any, headers: any[]) {
    dataCollection
      .filter((x) => this.termsToCalculate.includes(x.peers))
      .forEach((row: any) => {
        headers.forEach((columnName) => {
          let data = dataCollection
            .filter((x) => ValuationCalclation.isPositiveNumber(x[columnName.field]) && x.IsSelected)
            .map((item) => item[columnName.field]);
          switch (row.peers) {
            // calculation of mean
            case "Mean":
              row[columnName.field] = data.length > 0 ? math.mean(data) : "NA";
              break;
            // calculation of median
            case "Median":
              row[columnName.field] = data.length > 0 ? math.median(data) : "NA";
              break;
          }
        });
      });
  }

  addMeanAndMedian(peers: string, columnName: string, row: any, data: any) {
    switch (peers) {
      // calculation of mean
      case "Mean - Overall":
        row[columnName] = math.mean(data);
        break;
      // calculation of median
      case "Median - Overall":
        row[columnName] = math.median(data);
        break;
    }
  }

  isNumberCheck(str: any) {
    return isNumeric(str);
  }

  isNumberNMCheck(value) {
    return value < 0;
  }

  convertKpiValue(kpiVal: any, currencyUnit: number) {
    if (kpiVal != "" && kpiVal != null) {
      switch (Number(currencyUnit)) {
        case FinancialValueUnitsEnum.Millions:
          if (kpiVal != 0) {
            kpiVal = !isNaN(parseFloat(kpiVal)) && isNumeric(kpiVal) ? <number>kpiVal / 1000000 : kpiVal;
          }
          break;
        case FinancialValueUnitsEnum.Billions:
          if (kpiVal != 0) {
            kpiVal = !isNaN(parseFloat(kpiVal)) && isNumeric(kpiVal) ? <number>kpiVal / 1000000000 : kpiVal;
          }
          break;
        default: {
          if (kpiVal != 0) {
            kpiVal = !isNaN(parseFloat(kpiVal)) && isNumeric(kpiVal) ? <number>kpiVal / 1000 : kpiVal;
          }
          break;
        }
      }
    }
    return kpiVal;
  }
  isStaticCloumnHeader(val: any) {
    const staticFields = this.frozenCols.map((x) => x.field);
    return staticFields.indexOf(val) == -1;
  }

  printNAForSector(rowData: any, col) {
    if (
      (rowData.name === "Mean - Overall" ||
        rowData.name === "Median - Overall" ||
        rowData.name === "Mean" ||
        rowData.name === "Median") &&
      (col.field === "EV" || col.field === "MarketCap")
    )
      return "";
    else return "NA";
  }

  printNAForWithoutSector(rowData: any, col) {
    if (
      (rowData.peers === "Mean" ||
        rowData.peers === "Median") &&
      (col.field === "EV" || col.field === "MarketCap")
    )
      return "";
    else return "NA";
  }

  manageSelectedRecordIds(recordId: string){
    if(!this.unSelectedRecords?.find(x => x.kpiId === this.selectedKPIDropdown?.kpiId)){
      this.unSelectedRecords.push({
        recordIds: [],
        kpiId: this.selectedKPIDropdown?.kpiId
      });
    }
    if(this.unSelectedRecords?.find(x => x.kpiId === this.selectedKPIDropdown?.kpiId)?.recordIds.includes(recordId)){
      this.unSelectedRecords.forEach(un => {
        un.recordIds = un.recordIds.filter(y => y !== recordId);
      });
    }
    else{
      this.unSelectedRecords?.find(x => x.kpiId === this.selectedKPIDropdown?.kpiId)?.recordIds.push(recordId);
    }
  }

  clearCheckBoxList(flag: boolean){
    if(flag){
      this.checkBoxList = [];
      this._impliedEvService.setClearCheckBoxListFlag(false);
    }
  }

  handleCheckBoxVal(rowData: any, event: any) {
    if(rowData.Id !== "" && rowData.Id !== undefined && !this.checkBoxList?.map(x => x.id)?.includes(rowData.Id)){
      let checkBoxObj = new Object();
      checkBoxObj["id"] = rowData.Id;
      checkBoxObj["checked"] = event.target.checked;
      this.checkBoxList.push(checkBoxObj);
    }
    this.manageSelectedRecordIds(rowData.Id);
    this._impliedEvService.setUnselectedRecords(this.unSelectedRecords);
    let headerList = this.ColumsWithoutSector.filter(x => x.field != "EV" && x.field != "MarketCap")
    if (this.isWithSector) {
      let objToUpdate = this.dataCollection.find(obj => obj.children.some(child => child.data.Id === rowData.Id));
      if (objToUpdate) {
        let childToUpdate = objToUpdate.children.find(child => child.data.Id === rowData.Id);
        if (childToUpdate) {
          childToUpdate.data.IsSelected = event.target.checked;
        }
      }
      this.calculationForSectorData(this.dataCollection, headerList);
      let filterSectorData = this.dataCollection.filter((x) => x.children.length > 0 && x.data.name !== "All Comps");
      this.addMeanAndMedianForEachSector(filterSectorData, headerList);
    }
    else {
      let selectedData = this.dataCollection.find(x => x.Id === rowData.Id);
      if (selectedData) {
        selectedData.IsSelected = event.target.checked;
        this.calculationForWithoutSectorData(this.dataCollection, headerList)
      }
    }
    this._impliedEvService.setCheckBoxStateSubject(false);
    this._valuationService.setRedirectionStatus(false);
    let inputImpliedEV = this.dataCollection;
    const allCompsData = this.prepareDataForEmpliedEv(inputImpliedEV, this.isWithSector);
    if (allCompsData.length > 0) {
      this.getImpliedEvData(allCompsData);
    }
  }
}