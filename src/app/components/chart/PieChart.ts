import {
  Component,
  OnInit,
  OnChanges,
  ViewChild,
  ElementRef,
  Input,  
  AfterViewChecked,
  OnDestroy,
} from "@angular/core";
import * as Highcharts from "highcharts";
import * as HC_exporting_ from "highcharts/modules/exporting";
const HC_exporting = HC_exporting_;
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
NoDataToDisplay(Highcharts);
@Component({
  selector: "app-pie-chart",
  template: ` <div #divPieChart></div> `,
})
export class PieChartComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
  @ViewChild("divPieChart", { static: true }) chartContainer: ElementRef;
  @Input() nameField: string;
  @Input() valueField: string;
  chartCreated: boolean = false;
  dataClone: any[];
  dataOriginal: any[];
  chart_m: any;
  chart_r: any;
  color: any;
  totalValue: number = 0;
  hostElement: any;
  colorRange: string[] = ["#00568F",
    "#F39C12",
    "#26A69A",
    "#F77468",
    "#75787B"];
  options: any = {
  }
  get data(): any[] {
    return this.dataClone;
  }
  @Input()
  set data(data: any[]) {
    if (data != undefined) {
      this.dataOriginal == JSON.parse(JSON.stringify(data));
      this.dataClone = JSON.parse(JSON.stringify(data));
    }
  }

  ngOnInit(): void {
    //existing functionality
  }
  ngOnDestroy() {
    this.chartCreated = false;
  }
  ngOnChanges() {
    this.hostElement = this.chartContainer.nativeElement;
    this.chartCreated = false;
    if (this.hostElement.clientWidth > 0) {
      this.chartCreated = true;
      this.createPieChart();
    }
  }
  ngAfterViewChecked() {
    this.hostElement = this.chartContainer.nativeElement;
    if (this.hostElement.clientWidth > 0 && !this.chartCreated) {
      this.chartCreated = true;
      this.createPieChart();
    }
  }
  @Input() height: any;
  createPieChart() {
    let local = this;
    this.color = [
      "#00568F",
      "#F39C12",
      "#26A69A",
      "#F77468",
      "#75787B",
      "#5C6BC0",
      "#29B6F6",
      "#00838F",
      "#66BB6A",
      "#42A5F5",
      "#F77468",
      "rgb(204, 193, 140)",
      "rgb(210, 15, 70)"
    ];
    let tempdata: any[] = [];
    this.data?.forEach(function (val, i) {
      let color = local.color[i];
      switch (val[local.nameField]) {
        case "Active":
        case "Buyout":
          color = "#00568F"
          break;
        case "Passed":
        case "Venture":
          color = "#26A69A"
          break;
        case "Invested":
          color = "#665191"
          break;
        case "Identified":
          color = "#F39C12"
          break;
        default:
          color = local.color[i];
      }
      tempdata.push({
        name: val[local.nameField],
        y: parseFloat(val[local.valueField]),
        color: color,
      });
    });
    this.chart_m =
      (this.chartContainer.nativeElement.clientWidth /
        tempdata.length /
        2) *
      0.14;
    this.chart_r =
      (this.chartContainer.nativeElement.clientWidth /
        tempdata.length /
        2) *
      0.85;
    let ratio = 1;
    this.color = [
      "rgb(245, 140, 60)",
      "rgb(139, 148, 202)",
      "rgb(118, 163, 5)",
      "rgb(0, 50, 100)",
      "rgb(255, 200, 50)",
      "rgb(150, 80, 150)",
      "rgb(204, 193, 140)",
      "rgb(210, 15, 70)",
      "rgb(252, 194, 148)",
      "rgb(156, 199, 183)",
      "rgb(230, 150, 188)",
      "rgb(0, 181, 140)",
      "rgb(135, 140, 155)",
      "rgb(215, 0, 135)",
      "rgb(70, 190, 245)",
      "rgb(165, 150, 50)",
    ];
    this.options = {
      chart: {
        type: 'pie',
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            align:'center',
            format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
            distance: -50,
            filter: {
              property: 'percentage',
              operator: '>',
              value: 5
            }
          },
          showInLegend: true,
        }
      },
      series: [{
        name: 'Display',
        colorByPoint: true,
        data: tempdata,
      }]
      , lang: {
        noData: "No data found"
      },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '15px'
        },
      },
    }
    Highcharts.chart(this.chartContainer.nativeElement, this.options);
  }
}
