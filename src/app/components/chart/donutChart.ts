import {
  Component,
  OnInit,
  OnChanges,
  ViewChild,
  ElementRef,
  Input,
  AfterViewChecked,
  OnDestroy,
  SimpleChanges,
} from "@angular/core";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import * as d3 from "d3";
import * as Highcharts from "highcharts";
import * as HC_exporting_ from "highcharts/modules/exporting";
const HC_exporting = HC_exporting_;

@Component({
  selector: "app-donut-chart",
  template: ` <div #divDonutChart style="text-align:center"></div> `,
  //styleUrls: ['./chart.css']
})
export class DonutChartComponent
  implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
  @ViewChild("divDonutChart",{static: true}) chartContainer: ElementRef;
  //@Input() data: any[];
  @Input() catField: string;
  @Input() valField: string;
  @Input() unit: string;
  @Input() showLegends: boolean = false;
  @Input() title: string;
  @Input() colours: Array<string>;
  @Input() height: any;
  @Input() NoOfDecimals:number=1;
  @Input() isDisplay:number;
  @Input() isDynamicHeight:boolean = false;
  hostElement: any;
  svg: any;
  @Input() fullView: boolean = false;

  dataClone: any[];
  dataOriginal: any[];
  chart_m: any;
  chart_r: any;
  color: any;
  totalValue: number = 0;
  chartElementHeight:number = 0;
  get data(): any[] {
    // transform value for display
    return this.dataClone;
  }

  @Input()
  set data(data: any[]) {
    ;
    if (data != undefined) {
      this.dataOriginal == JSON.parse(JSON.stringify(data));
      this.dataClone = JSON.parse(JSON.stringify(data));
      this.dataClone = this.filterZeroValues(this.dataClone);
    }
  }

  filterZeroValues(data: any) {
    if (data != undefined) {
      let local = this;
      let result = data.filter(function (ele: any) {
        return ele[local.valField] != 0;
      });
      return result;
    }
    return data;
  }

  charts: any;
  constructor(
    private elRef: ElementRef,
    private miscService: MiscellaneousService
  ) {}

  ngOnInit() {
    // create chart and render
    //this.createChart();
  }
  ngOnDestroy() {
    // create chart and render
    this.chartCreated = false;
  }
  ngOnChanges(_changed:SimpleChanges) {
    this.hostElement = this.chartContainer.nativeElement;
    this.chartElementHeight = this.chartContainer.nativeElement.offsetHeight;
    this.chartCreated = false;
    if (this.hostElement.clientWidth > 0) {
      this.chartCreated = true;
      this.createChart();
    }

    if(this.isDisplay){
      Highcharts.charts.forEach(function(chart) { 
          chart?.reflow();
      });
    }
  }
  chartCreated: boolean = false;

  ngAfterViewChecked() {
    // viewChild is set after the view has been initialized
    // create chart and render
    this.hostElement = this.chartContainer.nativeElement;
    this.chartElementHeight = this.chartContainer.nativeElement.offsetHeight;
    if (this.hostElement.clientWidth > 0 && !this.chartCreated ) {
      this.chartCreated = true;
      this.createChart();
    }
  }

  CreateHighChart() {
    let chartSeriesData: any[] = [];
    let local = this;
    let type = [this.title];
    let unit = [" " + this.unit] || "";//[" " + this.unit]; -Theo & Rohit does not want M
    this.color = [
      "#388E3C",
      "#00568F",
      "#FFA000",
      "#C62828",
      "#F26524",
      "#212121",
      "#55565A",
      "#26A69A",
      "#5C6BC0",
      "#29B6F6",
      "#00838F",
      "#66BB6A",
      "#42A5F5",
      "#000000"
    ]; 
    this.data = this.filterZeroValues(this.dataOriginal);
    let total = 0;

    for (let i = 0; i < type.length; i++) {
      let tempdata: any[] = [];

      this.data?.forEach(function (val, i) {
        total += parseFloat(val[local.valField]);
        tempdata.push({
          name: val[local.catField],
          y: parseFloat(val[local.valField]),
          color: local.color[i],
        });
      });
      chartSeriesData.push({
        name: type[i],
        data: tempdata,
      });
    }

    this.totalValue = total;

    this.chart_m =
      (this.chartContainer.nativeElement.clientWidth /
        chartSeriesData.length /
        2) *
      0.14;
    this.chart_r =
      (this.chartContainer.nativeElement.clientWidth /
        chartSeriesData.length /
        2) *
      0.85;

    let ratio = 1;

    if (this.fullView) {
      let widthRatio =
        window.innerWidth / this.chartContainer.nativeElement.clientWidth;
      ratio = window.innerWidth / (window.innerHeight / widthRatio);

      this.chart_m =
        ((this.chartContainer.nativeElement.clientWidth /
          chartSeriesData.length /
          2) *
          0.6) /
        ratio;
      this.chart_r =
        ((this.chartContainer.nativeElement.clientWidth /
          chartSeriesData.length /
          2) *
          0.4) /
        ratio;
    }

    Highcharts.chart(this.chartContainer.nativeElement, {
      chart: {
        type: "pie",
        // options3d: {
        // 	enabled: true,
        // 	alpha: 45
        // },
        width: (local.chart_r + local.chart_m) * 2 * ratio,
        height: this.isDynamicHeight ? this.chartElementHeight:
          local.height === undefined
            ? (local.chart_r + local.chart_m) * 2
            : local.height,
        events: {
          // load: createCenterCircle,
          redraw: createCenterCircle,
          //render: createCenterCircle
        },
      },
      credits: {
        enabled: false,
      },
      accessibility: {
        enabled: false
      },
      title: {
        text: "",
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          //Here innerSize value in percentage because to make the inner size dymanic based on the size
          innerSize: "75%",
          // depth: local.chart_m,
          dataLabels: {
            enabled: local.fullView,
            formatter: function (_event) {
              return (
                this.key +
                " (" +
                Highcharts.numberFormat(this.percentage, 1) +
                "%)"
              );
            },
          },
          showInLegend: this.showLegends,
          point: {
            events: {
              mouseOver: function () {
                let ele = local.chartContainer.nativeElement;
                let categoryele = ele.getElementsByClassName("category");
                let valueele = ele.getElementsByClassName("value");
                let percentageele = ele.getElementsByClassName("percentage");
                let circleele = ele.getElementsByClassName("centercircle");

                categoryele[categoryele.length - 1].textContent = this.name;
                let value =
                  Highcharts.numberFormat(this.y, local.NoOfDecimals, ".", ",") + unit;
                let percentage =
                  Highcharts.numberFormat(this.percentage, local.NoOfDecimals) + "%";
                valueele[valueele.length - 1].textContent = value;
                percentageele[
                  percentageele.length - 1
                ].textContent = percentage;
                circleele[circleele.length - 1].setAttribute(
                  "r",
                  local.chart_r * (local.fullView  ? 1.4 : 0.7)
                ); //1.40
              },
              mouseOut: function (_event) {
                let ele = local.chartContainer.nativeElement;
                let categoryele = ele.getElementsByClassName("category");
                let valueele = ele.getElementsByClassName("value");
                let percentageele = ele.getElementsByClassName("percentage");
                let circleele = ele.getElementsByClassName("centercircle");

                categoryele[categoryele.length - 1].textContent = local.title;
                let value =
                  Highcharts.numberFormat(local.totalValue, local.NoOfDecimals, ".", ",") +
                  unit;
                valueele[valueele.length - 1].textContent = value;
                percentageele[percentageele.length - 1].textContent = "";
                circleele[circleele.length - 1].setAttribute(
                  "r",
                  local.chart_r * (local.fullView ? 1.37 : 0.67)
                ); //1.37
              },
            },
          },
        },
      },
      legend: {
        labelFormat: '{name} ({percentage:.1f}%)',
        itemStyle: {
          color: "black",
          fontSize: "18px",
          FontFamily: "Helvetica Neue",
      }
		},
      series: chartSeriesData,
      responsive: {
        rules: [
          {
            condition: {
              // maxWidth: 500
            },
            chartOptions: {
              legend: {
                align: "center",
                verticalAlign: "bottom",
                layout: "horizontal",
              },
              yAxis: {
                labels: {
                  align: "left",
                  x: 0,
                  y: -5,
                },
                title: {
                  text: null,
                },
              },
              subtitle: {
                text: null,
              },
              credits: {
                enabled: false,
              },
            },
          },
        ],
      },
      lang: {
        noData: "No records found",
      },
      tooltip: {
        enabled: false,
        useHTML: true,
        formatter: function () {
          let DecimalPoint: number = 1;

          let toolTip: string =
            "<table style='padding:0px;border:0px'><tr><td style='padding:0px;border:0px'><span style='color:" +
            this.point.color +
            "'>\u25CF </span><span style='font-weight: 600;'>" +
            this.key +
            "</span></td></tr><tr><td style='padding:0px;border:0px;text-align:center'>" +
            Highcharts.numberFormat(this.y, DecimalPoint, ".", ",") +
            unit +
            "</td></tr><tr><td style='padding:0px;border:0px;text-align:center'><span style='color:rgb(186, 12, 47)'>" +
            Highcharts.numberFormat(this.percentage, DecimalPoint) +
            "%</span></td></tr></table>";

          return toolTip;
        },
      },
    });
    function createCenterCircle() {
      let x = this.series[0].center[0] + this.plotLeft;
      let y = this.series[0].center[1] + this.plotTop;

      this.renderer
        .circle(x, y, local.chart_r * (local.fullView ? 1.37: 0.67)) //1.37
        .attr({
          fill: "#FFFF",
          class: "centercircle",
        })
        .add();

      this.renderer
        .text(local.title, x, y - 15)
        .attr("class", "center-txt category type")
        .attr("text-anchor", "middle")
        .css({
        "font-weight": "normal",
        })
        .show()
        .add();
      this.renderer
        .text(
          Highcharts.numberFormat(local.totalValue, local.NoOfDecimals, ".", ",") + unit,
          x,
          y
        )
        .attr("class", "center-txt value")
        .attr("text-anchor", "middle")
        .show()
        .add();
      this.renderer
        .text("", x, y + 15)
        .attr("class", "center-txt percentage")
        .attr("text-anchor", "middle")
        .css({
          "font-weight": "bold",
          fill: "#ba0c2f",
        })
        .show()
        .add();
    }
  }

  donutData: any;

  createChart() {
    this.CreateHighChart();
  }

  getCatNames(dataset: any) {
    let catNames = new Array();

    for (let i = 0; i < dataset[0].data.length; i++) {
      catNames.push(dataset[0].data[i].cat);
    }

    return catNames;
  }

  createLegend(catNames: any) {
    let local = this;

    let legends = local.charts
      .select(".legend")
      .selectAll("div")
      .data(catNames)
      .enter()
      .append("div")
      //.attr('class', 'col-6 col-sm-6')
      .append("svg")
      .attr("height", 50)
      .append("g")
      .attr("transform", function (_d: any, _i: any) {
        return "translate(" + 20 + ", 20)";
      });

    legends
      .append("circle")
      .attr("class", "legend-icon")
      .attr("r", 6)
      .style("fill", function (_d: any, i: any) {
        return local.color[i];
      });

    legends
      .append("text")
      .attr("dx", "1em")
      .attr("dy", ".3em")
      .text(function (d: any) {
        return d;
      });
  }

  createCenter() {
    let local = this;

    let donuts = local.charts.selectAll(".donut");

    // The circle displaying total data.
    donuts
      .append("svg:circle")
      .attr("r", local.chart_r * 0.7)
      .style("fill", "#E7E7E7")
      .on("mouseover", function (_d: any, _i: any,event:any) {
        d3.select(event.target)
          .transition()
          .attr("r", local.chart_r * 0.75);
      })
      .on("mouseout", function (_d: any, _i: any,event:any) {
        d3.select(event.target)
          .transition()
          .duration(500)
          .ease(d3.easeBounce)
          .attr("r", local.chart_r * 0.7);
      })
      .on("click", function (_d: any, _i: any,event:any) {
        event.stopPropagation();
        let paths = local.charts.selectAll(".clicked");
        local.pathAnim(paths, 0);
        paths.classed("clicked", false);
        local.resetAllCenterText();
      });
    //.on(eventObj);

    donuts
      .append("text")
      .attr("class", "center-txt category type")
      .attr("y", local.chart_r * -0.16)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text(function (d: any, _i: any) {
        return d.type;
      });
    donuts
      .append("text")
      .attr("class", "center-txt value")
      .attr("text-anchor", "middle");
    donuts
      .append("text")
      .attr("class", "center-txt percentage")
      .attr("y", local.chart_r * 0.16)
      .attr("text-anchor", "middle")
      .style("fill", "#ba0c2f")
      .style("font-weight", "bold");
    //.style('fill', '#A2A2A2');
  }

  setCenterText(thisDonut: any) {
    let local = this;
    let sum = d3.sum(thisDonut.selectAll(".clicked").data(), function (d: any) {
      return d.data.val;
    });

    let titleText = this.title;
    thisDonut.select(".category").text(function (_d: any) {
      return sum ? titleText : titleText;
    });

    thisDonut.select(".value").text(function (d: any) {
      return sum
        ? local.miscService.formatNumber(sum.toFixed(local.NoOfDecimals)) + d.unit
        : local.miscService.formatNumber(d.total.toFixed(local.NoOfDecimals)) + d.unit;
    });
    thisDonut.select(".percentage").text(function (d: any) {
      return sum
        ? local.miscService.formatNumber(((sum / d.total) * 100).toFixed(local.NoOfDecimals)) +
            "%"
        : "";
    });
  }

  resetAllCenterText() {
    let local = this;
    this.charts?.selectAll(".value").text(function (d: any) {
      return local.miscService.formatNumber(d.total.toFixed(1)) + d.unit;
    });
    this.charts?.selectAll(".percentage").text("");
  }

  pathAnim(path: any, dir: any) {
    let local = this;
    switch (dir) {
      case 0:
        path
          .transition()
          .duration(500)
          .ease(d3.easeBounce)
          .attr(
            "d",
            d3
              .arc()
              .innerRadius(local.chart_r * 0.8)
              .outerRadius(local.chart_r)
          );
        break;

      case 1:
        path.transition().attr(
          "d",
          d3
            .arc()
            .innerRadius(local.chart_r * 0.8)
            .outerRadius(local.chart_r * 1.08)
        );
        break;
    }
  }

  updateDonut() {
    let local = this;
    let pie = d3
      .pie()
      .sort(null)
      .value(function (d: any) {
        return d.val;
      });

    let data = this.genData();

    this.pieData = pie(data[0].data);

    let arc = d3
      .arc()
      .startAngle(function (d) {
        return d.startAngle;
      })
      .endAngle(function (d) {
        return d.endAngle;
      })
      .innerRadius(local.chart_r * 0.8)
      .outerRadius(function (d: any, i: any, n: any) {
        if (n) {
          return d3.select(n[i]).classed("clicked")
            ? local.chart_r * 1.08
            : local.chart_r;
        } else {
          try {
            return d3.select(d).classed("clicked")
              ? local.chart_r * 1.08
              : local.chart_r;
          } catch {
            return local.chart_r;
          }
        }
      });

    let paths = local.charts
      ?.selectAll(".donut")
      .selectAll("path")
      .data(function (d: any, _i: any) {
        return pie(d.data);
      });

    paths?.transition()?.duration(1000)?.attr("d", arc);

    paths
      ?.enter()
      ?.append("svg:path")
      ?.attr("d", arc)
      ?.style("fill", function (_d: any, i: any) {
        return local.color[i];
      })
      ?.style("stroke", "#FFFFFF")
      ?.on("mouseover", function (d: any, _i: any, _j: any,event:any) {
        local.pathAnim(d3.select(event.target), 1);

        let thisDonut = d3.select(d3.select(event.target).node().parentNode);
        if (!local.fullView) {
          thisDonut.select(".category").text(function (_donut_d: any) {
            return d.data.cat;
          });
          thisDonut.select(".value").text(function (donut_d: any) {
            return (
              local.miscService.formatNumber(d.data.val.toFixed(1)) +
              donut_d.unit
            );
          });
          thisDonut.select(".percentage").text(function (donut_d: any) {
            return (
              local.miscService.formatNumber(
                ((d.data.val / donut_d.total) * 100).toFixed(1)
              ) + "%"
            );
          });
        }
      })
      .on("mouseout", function (_d: any, _i: any, _j: any,event:any) {
        let thisPath = d3.select(event.target);
        if (!thisPath.classed("clicked")) {
          local.pathAnim(thisPath, 0);
        }
        if (!local.fullView) {
          let thisDonut = d3.select(
            d3.select(event.target).node().parentNode
          ); 
          local.setCenterText(thisDonut);
        }
      })
      .on("click", function (_d: any, _i: any, _j: any,event:any) {
        event.stopPropagation();
        if (!local.fullView) {
          let thisDonut = d3.select(
            d3.select(event.target).node().parentNode
          ); 

          if (0 === thisDonut.selectAll(".clicked").nodes().length) {
            thisDonut.select("circle").dispatch("click");
          }

          let thisPath = d3.select(event.target);
          let clicked = thisPath.classed("clicked");
          local.pathAnim(thisPath, ~~!clicked);
          thisPath.classed("clicked", !clicked);

          local.setCenterText(thisDonut);
        }
      });

    if (this.fullView) {
      let labelArc = d3
        .arc()
        .outerRadius(local.chart_r * 1.08)
        .innerRadius(local.chart_r * 1.28);

      this.text = this.svg
        .select(".labels")
        .selectAll("text")
        .data(this.pieData, function (d: any) {
          return d.data.cat;
        });

      let margin = {
        top: 80,
        bottom: 80,
        left: 120,
        right: 120,
      };

      let posList: any[] = [];

      this.text
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("id", function (_d: any, j: any) {
          return "l-" + j;
        })
        .attr("transform", function (d: any, _i: any, _n: any) {
          let pos = labelArc.centroid(d);
          pos[0] =
            local.chart_r *
            1.28 *
            (d.startAngle + (d.endAngle - d.startAngle) / 2 < Math.PI ? 1 : -1);
          posList.push(pos);
          return "translate(" + pos + ")";
        })
        .style("text-anchor", function (d: any) {
          return d.startAngle + (d.endAngle - d.startAngle) / 2 < Math.PI
            ? "start"
            : "end";
        })
        .attr("dy", ".35em")
        .attr("dx", ".35em")
        .attr("fill", "#111")
        .text(function (d: any) {
          return (
            d.data.cat +
            " (" +
            local.miscService.formatNumber(d.data.val.toFixed(local.NoOfDecimals)) +
            " " +
            //local.unit +
            ", " +
            local.miscService.formatNumber(
              ((d.data.val * 100) / data[0].total).toFixed(local.NoOfDecimals)
            ) +
            "%" +
            ")"
          );
        })
        .call(local.wrap, margin.right + 80);

      this.arrangeLabels(this.svg, ".label");

      let polyline = this.svg
        .select(".lines")
        .selectAll("polyline")
        .data(this.pieData, function (d: any) {
          return d.data.cat;
        });

      polyline
        .enter()
        .append("polyline")
        .style("stroke", function (_d: any, i: any) {
          return local.color[i];
        })
        .attr("points", function (d: any, j: any, _n: any) {
          let offset =
            d.startAngle + (d.endAngle - d.startAngle) / 2 < Math.PI ? 0 : 10;
          let label = d3.select("#l-" + j);
          let transform = local.getTransformation(label.attr("transform"));
          let pos = labelArc.centroid(d);
          pos[0] = transform.translateX + offset;
          pos[1] = transform.translateY;
          let mid = labelArc.centroid(d);
          mid[1] = transform.translateY;
          return [arc.centroid(d), mid, pos];
        });
    }

    paths?.exit()?.remove();

    local?.resetAllCenterText();
  }

  label_group: any = {};
  pieData: any;
  r: any = 150;
  textOffset: any = 15;

  text: any;

  create(dataset: any) {
    let local = this;

    local.chart_m =
      (this.chartContainer.nativeElement.clientWidth / dataset.length / 2) *
      0.14;
    local.chart_r =
      (this.chartContainer.nativeElement.clientWidth / dataset.length / 2) *
      0.85;

    let ratio = 1;

    if (this.fullView) {
      let widthRatio =
        window.innerWidth / this.chartContainer.nativeElement.clientWidth;
      ratio = window.innerWidth / (window.innerHeight / widthRatio);

      local.chart_m =
        ((this.chartContainer.nativeElement.clientWidth / dataset.length / 2) *
          0.6) /
        ratio;
      local.chart_r =
        ((this.chartContainer.nativeElement.clientWidth / dataset.length / 2) *
          0.4) /
        ratio;
    }

    local.charts
      .append("div")
      .attr("class", "legend row")
      .attr("width", "100%");

    let svg = (this.svg = local.charts
      .selectAll(".donut")
      .data(dataset)
      .enter()
      .append("svg:svg")
      .attr("width", (local.chart_r + local.chart_m) * 2 * ratio)
      .attr("height", (local.chart_r + local.chart_m) * 2));


    if (this.fullView) {
      this.svg
        .append("g")
        .attr("class", "labels")
        .attr(
          "transform",
          "translate(" +
            (local.chart_r + local.chart_m) * ratio +
            "," +
            (local.chart_r + local.chart_m) +
            ")"
        );

      this.svg
        .append("g")
        .attr("class", "lines")
        .attr(
          "transform",
          "translate(" +
            (local.chart_r + local.chart_m) * ratio +
            "," +
            (local.chart_r + local.chart_m) +
            ")"
        );
    }

    if (this.showLegends) {
      local.createLegend(local.getCatNames(dataset));
    }
    local.createCenter();

    local.updateDonut();
  }

  textTween(d: any, i: any) {
    let a;
    let oldPieData = this.pieData;
    let local = this;
    if (this.pieData[i]) {
      a = (oldPieData[i].startAngle + oldPieData[i].endAngle - Math.PI) / 2;
    } else if (!oldPieData[i] && oldPieData[i - 1]) {
      a =
        (oldPieData[i - 1].startAngle + oldPieData[i - 1].endAngle - Math.PI) /
        2;
    } else if (!oldPieData[i - 1] && oldPieData.length > 0) {
      a =
        (oldPieData[oldPieData.length - 1].startAngle +
          oldPieData[oldPieData.length - 1].endAngle -
          Math.PI) /
        2;
    } else {
      a = 0;
    }
    let b = (d.startAngle + d.endAngle - Math.PI) / 2;

    let fn = d3.interpolateNumber(a, b);
    return function (t: any) {
      let val = fn(t);
      return (
        "translate(" +
        Math.cos(val) * (local.chart_r + local.textOffset) +
        "," +
        Math.sin(val) * (local.chart_r + local.textOffset) +
        ")"
      );
    };
  }

  update(dataset: any) {
    let local = this;
    local.updateDonut();
  }
  //}
  genData() {
    let type = [this.title];
    let unit = [" " + this.unit];

    this.data = this.filterZeroValues(this.dataOriginal);

    let dataset = new Array();
    let local = this;
    for (let i = 0; i < type.length; i++) {
      let data = new Array();
      let total = 0;

      this.data?.forEach(function (val, _i) {
        total += parseFloat(val[local.valField]);
        data.push({
          cat: val[local.catField],
          val: parseFloat(val[local.valField]),
        });
      });

      dataset.push({
        type: type[i],
        unit: unit[i],
        data: data,
        total: total,
      });
    }

    return dataset;
  }

  getTransformation(transform: any) {
    let g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    g.setAttributeNS("", "transform", transform);
    let matrix = g.transform.baseVal.consolidate().matrix;

    let { a, b, c, d, e, f } = matrix;
    let scaleX, scaleY, skewX;
    if ((scaleX = Math.sqrt(a * a + b * b))){ (a /= scaleX); (b /= scaleX); }
    if ((skewX = a * c + b * d)){ (c -= a * skewX); (d -= b * skewX); }
    if ((scaleY = Math.sqrt(c * c + d * d))){(c /= scaleY); (d /= scaleY); (skewX /= scaleY);}
    if (a * d < b * c) { (a = -a); (b = -b); (skewX = -skewX); (scaleX = -scaleX);}
    return {
      translateX: e,
      translateY: f,
      rotate: (Math.atan2(b, a) * Math.PI) / 180,
      skewX: (Math.atan(skewX) * Math.PI) / 180,
      scaleX: scaleX,
      scaleY: scaleY,
    };
  }

  arrangeLabels(selection: any, label_class: string) {
    let move = 1;
    while (move > 0) {
      move = 0;

      let local = this;
      selection.selectAll(label_class).each(function (_d: any, i: any, n: any) {
        let that = n[i];
        let a = n[i].getBoundingClientRect();
        selection
          .selectAll(label_class)
          .each(function (_d2: any, i2: any, n2: any) {
            let curr = n2[i2];
            if (curr != that) {
              let b = curr.getBoundingClientRect();
              if (
                Math.abs(a.left - b.left) * 2 < a.width + b.width &&
                Math.abs(a.top - b.top) * 2 < a.height + b.height
              ) {
                let dx =
                  (Math.max(0, a.right - b.left) +
                    Math.min(0, a.left - b.right)) *
                  0.01;
                let dy =
                  (Math.max(0, a.bottom - b.top) +
                    Math.min(0, a.top - b.bottom)) *
                  0.04;
                let tt: any = local.getTransformation(
                  d3.select(curr).attr("transform")
                );
                let to: any = local.getTransformation(
                  d3.select(that).attr("transform")
                );
                move += Math.abs(dx) + Math.abs(dy);

                to.translate = [to.translateX + dx, to.translateY + dy];
                tt.translate = [tt.translateX - dx, tt.translateY - dy];
                d3.select(curr).attr(
                  "transform",
                  "translate(" + tt.translate + ")"
                );
                d3.select(that).attr(
                  "transform",
                  "translate(" + to.translate + ")"
                );
                a = curr.getBoundingClientRect();
              }
            }
          });
      });
    }
  }

  wrap(text: any, width: number) {
    text.each(function (_d: any, i: any, n: any) {
      let text = d3.select(n[i]);
      let words = text.text().split(/\s+/).reverse();
      let word;
      let line: any[] = [];
      let lineHeight = 1;
      let y = 0;
      let x = 0;
      let dx = parseFloat(text.attr("dx"));
      let tspan: any = text
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y);
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width - x) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", x)
            .attr("dy", lineHeight + "em")
            .attr("dx", dx + "em")
            .text(word);
        }
      }
    });
  }
}
