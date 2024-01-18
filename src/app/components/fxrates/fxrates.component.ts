
import { ActionsEnum, FeaturesEnum, UserSubFeaturesEnum } from "../../services/permission.service";
import { Component, HostListener, OnInit } from '@angular/core';
import { CurrencyService } from "src/app/services/currency.service";
@Component({
  selector: 'app-fxrates',
  templateUrl: './fxrates.component.html',
  styleUrls: ['./fxrates.component.scss']
})
export class FxratesComponent implements OnInit {
  feature: typeof FeaturesEnum = FeaturesEnum;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  fxrateslist = [];
  fxrateslistColumns = [];
  fxrateslistResults = [];
  Height='480px';
  isEnableView : boolean=false;
  frozenCols: any = [{ field: "fromCurrencyCode", header: "From Currency" }, { field: "toCurrencyCode", header: "To Currency" }];
  constructor(private currencyservice: CurrencyService) { }

  ngOnInit(): void {
    this.getBulkuploadfxrates();
  }
  @HostListener("window:resize")
  onResize() {
    this.Height = window.innerHeight * 0.70+'px';
  }
  getBulkuploadfxrates() {
    this.currencyservice.GetFxratesBulkUpload().subscribe((resp: any) => {
      this.fxrateslist = [];
      if (resp.code == "OK") {
        this.fxrateslist = resp.body;
        this.fxrateslistResults = resp.body;
        this.generateColumns();
        this.generateResults();
      }
      this.isEnableView = true;
    })
  }
  fxrateslistResultsfinal = [];
  generateResults() {
    let local = this;
    local.fxrateslistResultsfinal = this.fxrateslistResults;
    local.fxrateslistResults = this.unique(this.fxrateslistResults, ['fromCurrencyCode', 'toCurrencyCode']);
    this.fxrateslistColumns.forEach(function (e1) {
      local.fxrateslistResultsfinal.filter((x: any) => x.date == e1.field).forEach(x => {
        local.fxrateslistResults.filter((x1: any) => x1.fromCurrencyCode == x.fromCurrencyCode && x1.toCurrencyCode == x.toCurrencyCode).forEach(function (e) {
          if (typeof e === "object") {
            e[e1.field] = x.rate
          }
        });
      });
    });
  }
  colfield(value: string) {
    if (value == 'fromCurrencyCode' || value == 'fromCurrencyCode')
      return true
    else
      return false
  }
  notcolfield(value: string) {
    if (value != 'fromCurrencyCode' || value != 'fromCurrencyCode')
      return true
    else
      return false
  }
  unique(arr, keyProps) {
    const kvArray = arr.map(entry => {
      const key = keyProps.map(k => entry[k]).join('|');
      return [key, entry];
    });
    const map = new Map(kvArray);
    return Array.from(map.values());
  }
  generateColumns() {
    this.fxrateslist.forEach(x => {
      this.fxrateslistColumns.push({
        field: x.date,
        header: x.date,
      });
    })
    const ids = this.fxrateslistColumns.map(o => o.header)
    const filtered = this.fxrateslistColumns.filter(({ header }, index) => !ids.includes(header, index + 1));
    this.fxrateslistColumns = [];
    this.fxrateslistColumns = [...filtered];
  }
}
