import { Component, ElementRef, Input, OnInit, AfterViewInit, ViewChildren, QueryList, AfterViewChecked} from '@angular/core';
import { NgModel } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, repeat, takeUntil } from 'rxjs/operators';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { TemplateSections } from "src/app/common/constants";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";
import { Observable, Subject, timer } from 'rxjs';
@Component({
  selector: 'app-htmltopdf',
  templateUrl: './htmltopdf.component.html'
})
export class HtmltopdfComponent implements OnInit, AfterViewInit, AfterViewChecked {
  reportGraphData = [];
  @Input() model: any = {};
  quarter: string = "Quarter";
  monthQuarter: string = "MonthQuarter";
  graphHeaders = [];
  html: any;
  graphList: any = [];
  id: any;
  templateSections = TemplateSections;
  prop: boolean = true;
  isChart: boolean = false;
  exportLoading: boolean = false;
  @ViewChildren('button') button: QueryList<ElementRef>;
  @ViewChildren(NgModel) modelRefList: QueryList<NgModel>;
  isPageLoaded = false;
  isPageLoadedAfterView = false;
  observable$: Observable<any>;
  private readonly _stop = new Subject<void>();
  private readonly _start = new Subject<void>();
  lineColors: string[] = ['#941868', '#65b5eb']
  constructor(private portfolioCompanyService: PortfolioCompanyService, private _avRoute: ActivatedRoute, private miscService: MiscellaneousService) { }
  ngOnInit() {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.getGraphList(false);
    this.graphHeaders.push('Actual');
    this.graphHeaders.push('Budget');
  }
  onItemLabelLoaded(event) {
  }
  async getGraphList(e: any) {
    this.reportGraphData = [];
    this.isPageLoaded = false;
    this.isPageLoadedAfterView = false;
    this.portfolioCompanyService.lpReportGraphs(this.id).subscribe(async (res: any) => {
      if (res.code == "OK") {
        this.reportGraphData = res?.body?.reportGraphData;
        this.prop = false;
        this.isPageLoaded = true;
        this.isPageLoadedAfterView = true;
      }
    });
  }
  kpiUnit(data: any) {
    if (data?.data[0].Results[0]["Info"] != null || data?.data[0].Results[0]["info"] != null)
      return data?.data[0].Results[0]["Info"] == null ? data?.data[0].Results[0]["info"] : data?.data[0].Results[0]["Info"];
    return ""
  }
  ngAfterViewInit() {
    this.isChart = true;
    this.button?.changes?.subscribe(val => {
      this.prop = false;
      this.ngForRendred();
    });
    this.isPageLoadedAfterView = true;
  }
  ngAfterViewChecked() {
    this.isChart = true;
    this.button.changes.subscribe(val => {
      this.prop = false;
    });
  }
  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async LPReport() {
    this.exportLoading = true;
    await this.getGraphList(true);
    this.graphList = [];
    if (this.isPageLoaded && this.isPageLoadedAfterView) {
      this.downloadReport();
    }
    else {
      this.observable$ = timer(0, 100)
        .pipe(
          map(() => <any>{}),
          takeUntil(this._stop),
          repeat({ delay: () => this._start })
        );
      this.observable$.subscribe(() => {
        if (this.isPageLoadedAfterView && this.isPageLoaded) {
          console.log('chart loaded succeessfully');
          this.downloadReport();
          this.stop();
        }
      });
    }

  }
  start(): void {
    this._start.next();
  }
  ngForRendred() {
    console.log('NgFor is Rendered');
  }

  stop(): void {
    this._stop.next();
  }

  async downloadReport() {
    await this.sleep(5000);
    if (this.button.toArray().length > 0) {
      this.button.toArray().forEach((x, index) => {
        this.html = x.nativeElement.innerHTML;
        let obj = <any>{};
        obj.FundId = 0;
        obj.Section = x.nativeElement.id.split('///')[0];
        obj.KpiId = x.nativeElement.id.split('///')[1].split('//')[0];
        obj.Kpi = x.nativeElement.id.split('///')[1].split('//')[1];
        obj.PortfoliocompanyId = this.model.portfolioCompanyID;
        obj.Order = index + 1;
        obj.Html = x.nativeElement.innerHTML;
        this.graphList.push(obj);
      });
    }
    if (this.graphList == undefined)
      this.graphList = [];
    this.portfolioCompanyService.pdfExport({ Value: this.id, kpiGraphs: this.graphList }).subscribe({
      next:
        (results: any) => {
          this.miscService.downloadPDFFile(results);
          this.exportLoading = false;
          this.graphList = [];
        },
      error: (error) => {
        this.exportLoading = false;
      }
    });
  }
}
