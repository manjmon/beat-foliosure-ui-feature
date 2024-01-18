import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  ViewChild,
} from "@angular/core";
import * as d3 from "d3";
import * as Highcharts from "highcharts";
import * as HC_exporting_ from "highcharts/modules/exporting";
import { MiscellaneousService } from "../../services/miscellaneous.service";
const HC_exporting = HC_exporting_;

@Component({
  selector: "app-bar-chart-report",
  template: ` <div #divBarChart ></div> `,
})
export class BarChartReportComponent
  implements  OnChanges, AfterViewChecked {
  @ViewChild("divBarChart", { static: true }) chartContainer: ElementRef;

  @Input() xField: string;
  @Input() yField: string;
  @Input() barColors: string[];
  @Input() barHoverColors: string[];
  @Input() isMultiColorBars: boolean = false;
  @Input() unit: string = "";
  @Input() valueSuffix: string = "";
  @Input() NoOfDecimals: number = 1;
  @Input() colours: Array<string>;
  @Output() barClicked = new EventEmitter<any>();
  hostElement: any;
  @Input() shrinkSize: boolean = false;
  @Input() restoreWidth: number;
  width: number = 1000;
  height: number = 300;
  svg: any;

  dataClone: any[];

  get data(): any[] {
    return this.dataClone;
  }

  @Input()
  set data(data: any[]) {
    let local = this;
    if (data !== undefined) {
      this.dataClone = JSON.parse(JSON.stringify(data));
      if (this.dataClone !== undefined)
        this.dataClone.forEach(function (val: any) {
          val[local.yField] = local.convertToNumber(val[local.yField]);
        });
    }
  }

  constructor(
    private elRef: ElementRef,
    private miscService: MiscellaneousService
  ) { }

  colorRange = [
    "#46BEF5",
    "#197ec3",
    "#addb62",
    "#686662",
    "#ff99cc",
    "#c8e796",
    "#65b5eb",
    "#e4f3cb",
    "#ffcccc",
    "#9b9995",
    "#a1f7ec",
    "#f08e7f",
    "#a2befa",
    "#f5a905",
    "#ff7878",
    "#fffd94",
    "#2533f7",
    "#a1edf7",
    "#de4949",
    "#f5befa",
  ];

  ngOnChanges(_changes: { [propKey: string]: SimpleChange }) {
    this.hostElement = this.chartContainer.nativeElement;
    let heightRatio = 0.4;

    if (this.hostElement.clientWidth > 0) {
      if (this.shrinkSize) {
        this.width = this.hostElement.clientWidth / 3;
        this.height = this.width * heightRatio;
      } else {
        if (this.hostElement.clientWidth < 800) {
          heightRatio = 0.25;
        }
        if (this.restoreWidth != undefined && this.restoreWidth != null) {
          this.width = this.restoreWidth;
        } else if (this.hostElement) {
          this.width = this.hostElement.clientWidth;
        } else {
          this.width = 1000;
        }
        this.height = this.width * heightRatio;
      }
      if (this.height < 180) {
        this.height = 180;
      }
      this.chartCreated = true;
      setTimeout(
        function (local: any) {
          local.createHightChart(local.xField, local.yField, local.data);
        },
        0,
        this
      );
    }
  }
  createHightChart(xField: any, yField: any, data: any[]) {
    let local = this;
    let arrCategories: any[] = [];
    let arrSeries: any[] = [];
    let arrData: any[] = [];

    data.forEach(function (val, i) {
      arrCategories.push(val[xField]);
      let colorIndex = 0;
      if (local.isMultiColorBars) {
        colorIndex = i;
      }
      arrData.push({
        y: val[yField],
        color: local.colorRange[colorIndex],
      });
    });

    arrSeries.push({
       name: yField,
      data: arrData,
    });
    Highcharts.chart({
      chart: {
        type: 'column',
        renderTo: this.chartContainer.nativeElement,
        //zoomType : 'xy',
        width:620,
        height:620,
        style: {
          fontWeight: 'normal',
          color: "#ABABAB",
          fontSize: "18px",
          fontFamily: "Helvetica",
        },
      },
      colors: ["#46BEF5"],
      title: {
        text: "",
      },
      accessibility: {
        enabled: false
      },
      xAxis: {
        type:"category",
        categories: arrCategories,
        title: {
          text: xField,
        },
        labels: {
          style: {
            textAlign: "center",
            whiteSpace: "nowrap",
            fontSize: "18px",
            FontFamily: "Helvetica",
            textOverflow: "none",
            fontWeight: 'normal',
            color: "#55565A",
            padding:'10px'
          },
          step:1,
          padding:10,
          staggerLines:1,
          useHTML: true,
          reserveSpace: true,
          rotation: -60,
        },
      },
      legend:{
        // itemStyle:{
        //   whiteSpace: "normal",
        //   fontSize: "16px",
        //   FontFamily: "Helvetica",
        //   fontWeight: 'bold',
        //   textOverflow: "none",
        //   textAlign:'left'
        // }
        enabled:false
      },
      yAxis: {
        min: 0,
        title: {
          text: yField + (local.unit != "" ? " (" + local.unit + ")" : ""),
        },
        labels: {
          formatter: function () {
            let DecimalPoint: number = 0;
            if (String(this.value).indexOf(".") >= 0) DecimalPoint = 1;
            return Highcharts.numberFormat(Number(this.value), DecimalPoint, ".", ",");
          },
          style: {
            textAlign: "center",
            whiteSpace: "normal",
            fontSize: "18px",
            FontFamily: "Helvetica",
            textOverflow: "none",
            fontWeight: 'normal',
          },
        },
        tickAmount: 5,
      },
      tooltip: {
        formatter: function () {
          let DecimalPoint: number = 0;
          if (String(this.point.y).indexOf(".") >= 0) DecimalPoint = local.NoOfDecimals;

          let unit: string = "";
          if (local.unit != "") unit = " (" + local.unit + ")";

          let toolTip: string =
            "<span style='color:" +
            this.point.color +
            "'>\u25CF </span><span style='font-weight: 600;'>" +
            this.x +
            unit +
            "</span>: " +
            Highcharts.numberFormat(this.point.y, DecimalPoint, ".", ",") +
            " " +
            local.valueSuffix;
          return toolTip;
        },
        useHTML: true,
      },
      plotOptions: {
        column: {
          animation:false,
          pointPadding: 0.3,
          borderWidth: 0
        },
        series: {
          cropThreshold: 100,
          dataLabels: {
            allowOverlap:false,
            enabled: true,
            formatter: function (_event) {
              let DecimalPoint: number = 0;
              if (String(this.point.y).indexOf(".") >= 0) DecimalPoint = local.NoOfDecimals;

              return (
                Highcharts.numberFormat(
                  this.point.options.y,
                  DecimalPoint,
                  ".",
                  ","
                ) + (local.valueSuffix != "" ? " " + local.valueSuffix : "")
              );
            },
            style: {
              fontWeight: "normal",
              fontSize: "18px",
              color: "#212121",
              fontFamily: "Helvetica",
            },
            overflow: "allow",
            crop: false,
          },
        },
      },
      series: arrSeries,
      credits: {
        enabled: false,
      },
    });
  }

  chartCreated: boolean = false;

  ngAfterViewChecked() {
    this.hostElement = this.chartContainer.nativeElement;
    if (this.hostElement.clientWidth > 0 && !this.chartCreated) {
      if (this.shrinkSize) {
        this.width = this.hostElement.clientWidth / 3;
        this.height = this.width * 0.5;
      } else {
        if (this.hostElement) {
          this.width = this.hostElement.clientWidth;
        } else {
          this.width = 1000;
        }
        this.height = this.width * 0.5;
      }
      this.chartCreated = true;
      if (this.data === undefined) this.data = [];
      this.createHightChart(this.xField, this.yField, this.data);
    }
  }

  convertToNumber(num: string) {
    if (num != null) {
      if (String(num).match(/^-{0,1}\d+$/)) {
        return parseInt(num);
      } else if (!isNaN(parseFloat(num))) {
        return parseFloat(num);
      }
    }
    return null;
  }

  divTooltip: any;
  createChart(xField: any, yField: any, data: any[]) {
    d3.select(this.hostElement).html("");
    if (this.divTooltip) {
      this.divTooltip.remove();
    }
    let margin = { top: 20, right: 20, bottom: 70, left: 105 },
      width = this.width - margin.left - margin.right,
      height = this.height - margin.top - margin.bottom;

    if (!this.barColors || this.barColors.length == 0) {
      this.barColors = ["#80cdf0", "#878c9b", "#f58c3c"];
    }
    if (!this.barHoverColors || this.barHoverColors.length == 0) {
      this.barHoverColors = ["#f58c3c", "#80cdf0", "#878c9b"];
    }
    let color = d3.scaleOrdinal().range(this.barColors);
    let hoverColor = d3.scaleOrdinal().range(this.barHoverColors);

    let x = d3.scaleBand().rangeRound([0, width]).paddingInner(0.05);
    let y = d3.scaleLinear().range([height, 0]);

    let timestamp = new Date().toString();

    this.divTooltip = d3
      .select("body")
      .append("div")
      .attr("id", "divtoolTip" + timestamp)
      .attr("class", "toolTip");

    this.svg = d3
      .select(this.hostElement)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let local = this;

    let maxVal = d3.max(data, function (d: any) {
      let val: any = local.convertToNumber(d[yField]);

      return val;
    });

    let fractionValues = data.filter(function (val: any) {
      return !Number.isInteger(val[yField]);
    });

    x.domain(
      data.map(function (d: any) {
        return d[xField];
      })
    );
    y.domain([0, maxVal]);

    let ticks = y.ticks(4);

    let lastTick = ticks[ticks.length - 1],
      newLastTick = lastTick + (ticks[1] - ticks[0]);

    if (fractionValues.length == 0) {
      ticks = ticks.filter(function (val: number) {
        return Number.isInteger(val);
      });
      lastTick = ticks[ticks.length - 1];
      newLastTick = lastTick + (ticks[1] - ticks[0]);
    }

    if (lastTick < y.domain()[1]) {
      ticks.push(newLastTick);
      y.domain([y.domain()[0], newLastTick]);
    } else {
      y.domain([y.domain()[0], lastTick]);
    }

    d3.format(".0%");
    let xAxis = d3.axisBottom(x);
    let yAxis = d3
      .axisLeft(y)
      .tickPadding(10)
      .tickFormat(function (d) {
        return local.miscService.formatNumber(d.toString());
      })
      .tickValues(ticks);

    function make_y_gridlines() {
      return d3.axisLeft(y).tickValues(ticks);
    }

    this.svg
      .append("g")
      .attr("class", "grid")
      .call(make_y_gridlines().tickSize(-width))
      .selectAll("text")
      .remove();

    this.svg
      .append("g")
      .attr("class", "x-axis sweta")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("dx", "-.8em")
      .attr("dy", ".8em")
      .attr("transform-origin", "3px 40px")
      .attr("transform", "rotate(-15)");

    this.svg
      .select("g.x-axis")
      .call(xAxis)
      .append("text")
      .attr("transform", "translate(" + width / 2 + "," + 40 + ")")

      .attr("dy", ".71em")
      .attr("class", "axis-label")
      .style("text-anchor", "end")
      .text(local.xField);

    let svgYAxis = this.svg.append("g").attr("class", "y-axis").call(yAxis);

    let tickNodes = svgYAxis.selectAll("g.tick").nodes();
    let maxTickWidth = 0;
    if (tickNodes.length > 0) {
      maxTickWidth = Math.max.apply(
        Math,
        tickNodes.map(function (val: any) {
          let text: any = d3.select(val).select("text");
          return text.node().getBoundingClientRect().width;
        })
      );
    }

    svgYAxis
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - height / 2)
      .attr("y", 0 - 30 - maxTickWidth)

      .attr("dy", ".71em")
      .attr("class", "axis-label")
      .style("text-anchor", "middle")
      .text(
        local.yField +
        (local.unit && local.unit.trim() != "" ? " (" + local.unit + ")" : "")
      );

    let barWidth = Math.min(x.bandwidth(), 50);

    let bar = this.svg
      .selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d: any) {
        let res = x(d[xField]);
        return res != undefined ? res + x.bandwidth() / 2 - barWidth / 2 : 0;
      })
      .attr("width", barWidth)
      .attr("y", function (d: any) {
        return y(d[yField]);
      })
      .attr("pointer-events", "none");

    if (this.isMultiColorBars) {
      bar.style("fill", function (_d: any, i: any) {
        return color(i);
      });
    }

    bar
      .transition()
      .ease(d3.easeBounce)
      .duration(1000)
      .attr("height", function (d: any) {
        return height - y(d[yField]);
      })
      .transition()
      .attr("pointer-events", "");

    let barText = this.svg
      .selectAll("text.bar")
      .data(data)
      .enter()
      .append("text")
      .attr("id", function (d: any) {
        return d.Index;
      })
      .attr("class", "bar")
      .attr("text-anchor", "middle")
      .attr("x", function (d: any) {
        let res = x(d[xField]);

        return res != undefined ? res + x.bandwidth() / 2 : 0;
      })
      .attr("y", function (d: any) {
        return y(d[yField]) - 5;
      })
      .text(function (d: any) {
        return (
          local.miscService.formatNumber(d[yField]) +
          (local.valueSuffix != "" ? " " + local.valueSuffix : "")
        );
      });

    this.svg
      .selectAll("g.x-axis > g.tick")
      .nodes()
      .forEach(function (ele: any, _k: any) {
        let element = ele.getElementsByTagName("text")[0].innerHTML;
        if (element.length > 15) {
          ele.getElementsByTagName("text")[0].innerHTML = element
            .substr(0, 15)
            .concat("...");
        }
      });

    barText.on("mousemove", function (d: any,event:any) {
      if (!local.shrinkSize) {
        local.divTooltip.style("left", event.pageX + 10 + "px");
        local.divTooltip.style("top", event.pageY - 25 + "px");
        local.divTooltip.style("display", "inline-block");
        local.divTooltip.html(
          d[xField] +
          (local.unit && local.unit.trim() != ""
            ? " (" + local.unit + ")"
            : "") +
          " : " +
          local.miscService.formatNumber(d[yField]) +
          (local.valueSuffix != "" ? " " + local.valueSuffix : "")
        );
      }
    });

    barText.on("mouseout", function (_d: any,event:any) {
      if (!local.shrinkSize) {
        local.divTooltip.style("display", "none");
        if (local.isMultiColorBars) {
          d3.select(event.target).style(
            "fill",
            function (_d: any, _i: any, n) {
              let index = d3
                .select(n[0].parentNode)
                .selectAll("text.bar")
                .nodes()
                .indexOf(n[0]);
              return "" + color(index.toString()) + "";
            }
          );
        }
      }
    });
    barText.on("mouseover", function (_d: any,event:any) {
      if (!local.shrinkSize && local.isMultiColorBars) {
        d3.select(event.target).style("fill", function (_d: any, _i: any, n) {
          let index = d3
            .select(n[0].parentNode)
            .selectAll("text.bar")
            .nodes()
            .indexOf(n[0]);
          return "" + hoverColor(index.toString()) + "";
        });
      }
    });

    bar.on("mousemove", function (d: any,event:any) {
      if (!local.shrinkSize) {
        local.divTooltip.style("left", event.pageX + 10 + "px");
        local.divTooltip.style("top", event.pageY - 25 + "px");
        local.divTooltip.style("display", "inline-block");
        local.divTooltip.html(
          d[xField] +
          (local.unit && local.unit.trim() != ""
            ? " (" + local.unit + ")"
            : "") +
          " : " +
          local.miscService.formatNumber(d[yField]) +
          (local.valueSuffix != "" ? " " + local.valueSuffix : "")
        );
      }
    });

    bar.on("mouseover", function (_d: any,event:any) {
      if (!local.shrinkSize && local.isMultiColorBars) {
        d3.select(event.target).style(
          "fill",
          function (_d: any, _i: any, n: any) {
            let index = d3
              .select(n[0].parentNode)
              .selectAll("rect.bar")
              .nodes()
              .indexOf(n[0]);
            return "" + hoverColor(index.toString()) + "";
          }
        );
      }
    });
    bar.on("mouseout", function (_d: any,event:any) {
      if (!local.shrinkSize) {
        local.divTooltip.style("display", "none");
        if (local.isMultiColorBars) {
          d3.select(event.target).style(
            "fill",
            function (_d: any, _i: any, n) {
              let index = d3
                .select(n[0].parentNode)
                .selectAll("rect.bar")
                .nodes()
                .indexOf(n[0]);
              return "" + color(index.toString()) + "";
            }
          );
        }
      }
    });

    bar.on("click", function (d: any) {
      if (!local.shrinkSize) {
        local.barClicked.emit({ xValue: d[xField], currentWidth: local.width });
      }
    });
  }
}
