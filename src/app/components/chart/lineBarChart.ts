import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import * as d3 from "d3";
import * as Highcharts from 'highcharts/highstock';
import * as HC_exporting_ from "highcharts/modules/exporting";
import { MiscellaneousService } from "../../services/miscellaneous.service";

const HC_exporting = HC_exporting_;

@Component({
  selector: "app-lineBar-chart",
  template: ` <div #divLineBarChart></div> `,
})
export class LineBarChartComponent implements OnChanges {
  @ViewChild("divLineBarChart", { static: true }) chartContainer: ElementRef;
  @Input() yLineFieldText:string="";
  @Input() colours: Array<string>;
  @Input() xField: string;
  @Input() height: any;
  @Input() yBarFields: string[];
  @Input() yLineFields: string[];
  @Input() barColors: string[];
  @Input() barHoverColors: string[];
  @Input() lineColors: string[];
  @Input() unit: string = "";
  @Input() NoOfDecimals: number = 1;
  @Input() customHeight: any;
  @Input() valueSuffix: string = "";
  @Input() isDisplay: number;
  @Input() lineChartType: string;
  @Input() barChartType: string;
  @Input() dynamicSpline: string = "0";
  @Input() isTickMin:boolean =  false;
  @Input() isScrollBar: boolean = false;
  dataClone: any[];
  get data(): any[] {
    return this.dataClone;
  }

  @Input()
  set data(data: any[]) {
    if (data != undefined && data.length > 0) {
      this.dataClone = JSON.parse(JSON.stringify(data));
    } else {
      this.dataClone = [];
    }
  }

  get ifLineChartDataAvailable(): boolean {
    return this.yLineFields && this.yLineFields.length > 0;
  }

  svg: any;
  opacity: any;
  chart: any;
  hostElement: any;
  divTooltip: any;
  divLineTooltip: any;
  create: any;
  update: any;

  constructor(
    private elRef: ElementRef,
    private miscService: MiscellaneousService
  ) { }

  ngOnChanges(_change: SimpleChanges) {
    this.createHightChart();
    if (this.isDisplay) {
      Highcharts.charts.forEach(function (chart) {
        chart?.reflow();
      });
    }
  }
  colorRange = [
    "#26a69a",
    "#f39c12",
    "#03499A",
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

  createHightChart() {

    let local = this;
    let arrCategories: any[] = [];
    let arrSeries: any[] = [];

    if (this.data != null || this.data != undefined) {
      if (this.data.length > 0) {
        this.data.forEach(function (val, _i) {
          arrCategories.push(val[local.xField]);
        });

        for (let index = 0; index < this.yBarFields.length; index++) {
          let data: any[] = [];
          this.data.forEach(function (val, _i) {
            data.push(local.convertToNumber(val[local.yBarFields[index]]));
          });

          arrSeries.push({
            name: this.yBarFields[index],
            type: "column",
            yAxis: 1,
            data: data,
          });
        }

        for (let index = 0; index < this.yLineFields.length; index++) {
          let data: any[] = [];
          let splinecolor: string = '#021155';
          this.data.forEach(function (val, _i) {
            if (local.yLineFields[index] == '% Change In Budget Value')
              splinecolor = '#f58c3c';
            else if (local.yLineFields[index] == '% Change In Forecast Value')
              splinecolor = '#03499A';
            data.push(local.convertToNumber(val[local.yLineFields[index]]));
          });
          let lineColor: string = "#42A5F5";
          splinecolor = this.dynamicSpline != '0' ? this.dynamicSpline : splinecolor;
          lineColor = this.dynamicSpline != '0' ? this.dynamicSpline : lineColor;
          arrSeries.push({
            name: this.yLineFields[index],
            type: "spline",
            data: data,
            color: splinecolor,
            marker: {
              lineWidth: 2,
              lineColor: lineColor,
              fillColor: "white",
            },
          });
        }
      } else {
        arrCategories = [];
        arrSeries = [];
      }
    }

    let parentWidth = 960;
    let dHeight: any, dWdith: any;
    this.hostElement = this.chartContainer.nativeElement;
    if (this.hostElement && this.hostElement.clientWidth > 0) {
      parentWidth = this.hostElement.clientWidth - 10;
    }

    let h = parentWidth * 0.5;
    if (this.height != null && this.height != undefined) {
      if (this.height < 180) {
        this.height = 180;
      }
      h = this.height;
    }

    /******To handle different div layouts*************[Start]***/
    let classNames = ["col-sm-6", "col-md-6"];
    let flag = 0;
    let containerClass = this.chartContainer.nativeElement.offsetParent
      .className;
    classNames.forEach(function (val: any, _key: any) {
      if (containerClass.indexOf(val) >= 0) {
        flag++;
      }
    });

    if (flag > 0) {
      var margin = { top: 50, right: 80, bottom: 70, left: 115 },
        height = h - margin.top - margin.bottom;
    } else {
      let customHeight = 250;
      if (this.customHeight) {
        customHeight = 370;
      }
      var margin = { top: 35, right: 60, bottom: 30, left: 100 },
        height = customHeight - margin.top - margin.bottom;
    }
    if (this.barColors && this.barColors.length > 0) {
      this.colorRange = this.barColors;
    }
    let ChartColors = this.colorRange;

    Highcharts.chart({
      chart: {
        renderTo: this.chartContainer.nativeElement,
        //zoomType: "xy",
        height: height + margin.top + margin.bottom + 30,
        style: {
          color: "#55565A",
          fill: "#55565A",
          fontSize: "14px",
          fontFamily: "Helvetica",
        },
        scrollablePlotArea: {
          scrollPositionX: this.isScrollBar?0: undefined,
          minWidth: this.isScrollBar?(this.data?.length)*100:undefined,          
        }
      },
      accessibility: {
        enabled: false
      },
      colors: ChartColors,
      title: {
        text: "",
      },
      xAxis: [
        {
          lineColor:"#dedfe0",
          categories: arrCategories,
          crosshair: true,
          labels: {
            reserveSpace: true,
            style: {
              textAlign: "center",
              whiteSpace: "normal",
              fontSize: '14px',
              color: "#55565A",
              fill: "#55565A",
              fontFamily: "Helvetica",
              textOverflow: 'ellipsis',
              //width:100,
              useHTML: false,
              padding: "10px"
            },
            autoRotationLimit: 2800,
            autoRotation: [0],
            useHTML: true
          },
          title: {
            // text: "1"           
          },
          // min: this.isCompanyKpi?0:undefined,
          // max: this.isCompanyKpi?(this.data.length>8?8:(this.data.length-1)):undefined,
          // scrollbar: {
          //     enabled:this.isCompanyKpi?true:false
          // },
        },
      ],
      yAxis: [
        {
          minTickInterval:this.isTickMin?1:null, 
          min:this.isTickMin?0:null,
          className:'highcharts-y-axis-font-size',        
          title: {
            text:this.yLineFieldText?.length==0? this.SetText(local):this.yLineFieldText,
            rotation: 270,
            x: 7,
            style: {
              color: "#55565A",
              fill: "#55565A",
              fontSize: "14px"
            }
          },
          labels: {
            padding: 10,
            format: "{value:,.0f} ",
            style: {
              fontSize: "14px",
              color: "#55565A",
              fill: "#55565A",
              fontFamily: "Helvetica"
            },
            formatter: function () {
              let DecimalPoint: number = 0;
              if (local.lineChartType == 'currency') {
                DecimalPoint = 1;
              }
              return Highcharts.numberFormat(
                Number(this.value),
                DecimalPoint,
                ".",
                ","
              );
            },
          },
          tickAmount: 5,
          opposite: true,
        },
        {
          min:this.isTickMin?0:null,
          className:'highcharts-y-axis-font-size',
          title: {
            text:
              local.yBarFields?.join("/") +
              (local.unit != "" ? " (" + local.unit + ")" : ""),
          },
          labels: {
            format: "{value:,.0f} ",
            style: {
              fontSize: "14px",
              fontFamily: "Helvetica",
              color: "#55565A",
              fill: "#55565A"
            },
            formatter: function () {
              let DecimalPoint: number = 0;

              if (String(this.value).indexOf(".") >= 0) DecimalPoint = local.NoOfDecimals;

              return Highcharts.numberFormat(
                Number(this.value),
                DecimalPoint,
                ".",
                ","
              );
            },
          },
          tickAmount: 5,
        },
      ],
      lang: {
        noData: "No records found",
      },
      tooltip: {
        padding:1,
        shadow: false,
        backgroundColor: '#FFFFFF',
        useHTML: true,
        formatter: function () {
          let DecimalPoint: number = 0;
          let unit: string = "";
          if (
            local.yBarFields.filter(
              (x) => x.indexOf(this.point.series.name) >= 0
            ).length > 0
          )
            unit = local.unit != "" ? " (" + local.unit + ")" : "";

          if (this.point.series.name.includes("#") || unit.includes("#")  || this.point.series.name == "No Of Funds") {
            DecimalPoint = 0;
          } else {
            DecimalPoint = 1;
          }
          let toolTip: string =
            "<span style='color:" +
            this.point.color +
            "'>\u25CF </span><span style='font-weight: 600;'>" +
            this.point.series.name +
            unit +
            "</span><br/>" +
            this.key +
            ": " +
            Highcharts.numberFormat(this.point.y, DecimalPoint, ".", ",");
          return toolTip;
        },
      },
      legend: {
        align: "center",
        verticalAlign: "bottom",
        x: 0,
        y: 0,
        itemStyle: {
          color: '#55565A',
          fontSize: '14px',
          fill: "#55565A"
        }
      },
      plotOptions: {
        series: {
          stacking: this.isScrollBar?undefined:"normal",

        },
        column: {
          stacking: this.isScrollBar?undefined:"normal",
          minPointLength: 3
        }
      },
      series: arrSeries,
      credits: {
        enabled: false,
      }
    });
  }

  generateData() {
    let local = this;
    let result: any[] = [];
    this.data.forEach(function (val: any) {
      let obj: any = {};
      obj.Date = val[local.xField];
      obj.Categories = [];
      local.yBarFields.forEach(function (yBarField: any) {
        let barCat: any = {};
        barCat.Name = yBarField;
        barCat.Value = local.convertToNumber(val[yBarField]);
        obj.Categories.push(barCat);
      });
      if (local.ifLineChartDataAvailable) {
        obj.LineCategory = [];
        local.yLineFields.forEach(function (yLineField: any) {
          let lineCat: any = {};
          lineCat.Name = yLineField;
          lineCat.Value = local.convertToNumber(val[yLineField]);
          obj.LineCategory.push(lineCat);
        });
      }
      result.push(obj);
    });

    return result;
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

  getTextWidth(text: string, fontSize: any, fontName: string) {
    let c = document.createElement("canvas");
    let ctx = c.getContext("2d");
    if (ctx != null) {
      ctx.font = fontSize + " " + fontName;
      return ctx.measureText(text).width * 1.25;
    }
    return 0;
  }

  DataSegregator(array: any[], on: any) {
    let SegData: any;
    let OrdinalPositionHolder: any = {
      valueOf: function () {
        let thisObject: any = this;
        let keys = Object.keys(thisObject);
        keys.splice(keys.indexOf("valueOf"), 1);
        keys.splice(keys.indexOf("keys"), 1);
        return keys.length == 0
          ? -1
          : d3.max(keys, function (d) {
            return thisObject[d];
          });
      },
      keys: function () {
        let thisObject: any = this;
        let keys = Object.keys(thisObject);
        keys.splice(keys.indexOf("valueOf"), 1);
        keys.splice(keys.indexOf("keys"), 1);
        return keys;
      },
    };
    array[0]
      .map(function (d: any) {
        return d[on];
      })
      .forEach(function (b: any) {
        let value = OrdinalPositionHolder.valueOf();
        OrdinalPositionHolder[b] = OrdinalPositionHolder > -1 ? ++value : 0;
      });

    SegData = OrdinalPositionHolder.keys().map(function () {
      return [];
    });

    array.forEach(function (d) {
      d.forEach(function (b: any) {
        SegData[OrdinalPositionHolder[b[on]]].push(b);
      });
    });

    return SegData;
  }

  createChart() {
    d3.select(this.hostElement).html("");
    let timestamp = new Date().toString();
    let local = this;
    let parentWidth = 960;
    this.hostElement = this.chartContainer.nativeElement;
    if (this.hostElement && this.hostElement.clientWidth > 0) {
      parentWidth = this.hostElement.clientWidth - 10;
    }

    let h = parentWidth * 0.5;
    if (this.height != null && this.height != undefined) {
      if (this.height < 180) {
        this.height = 180;
      }

      h = this.height;
    }

    /******To handle different div layouts*************[Start]***/
    let classNames = ["col-sm-6", "col-md-6"];
    let flag = 0;
    let containerClass = this.chartContainer.nativeElement.offsetParent
      .className;
    classNames.forEach(function (val: any, _key: any) {
      if (containerClass.indexOf(val) >= 0) {
        flag++;
      }
    });

    if (flag > 0) {
      var margin = { top: 50, right: 80, bottom: 70, left: 115 },
        width = parentWidth - margin.left - margin.right,
        height = h - margin.top - margin.bottom;
    } else {
      let customHeight = 250;
      if (this.customHeight) {
        customHeight = 370;
      }
      var margin = { top: 35, right: 60, bottom: 30, left: 100 },
        width = 750 - margin.left - margin.right,
        height = customHeight - margin.top - margin.bottom;
    }
    /******To handle different div layouts************[End]*****/

    let textWidthHolder = 0;

    let Categories = new Array();

    let x0 = d3.scaleBand().rangeRound([0, width]);

    let XLine = d3.scaleBand().rangeRound([0, width]).padding(0.1);

    let x1 = d3.scaleBand();

    let maxLeftVal = d3.max(this.data, function (d: any) {
      let maxCat: any = d3.max(d.Categories, function (b: any) {
        return b.Value;
      });
      return maxCat;
    });

    let minLeftVal = d3.min(this.data, function (d: any) {
      let minCat: any = d3.min(d.Categories, function (b: any) {
        return b.Value;
      });
      return minCat < 0 ? minCat : 0;
    });

    let fractionValues = this.data.filter(function (d: any) {
      let res = d.Categories.filter(function (b: any) {
        return !Number.isInteger(b.Value);
      });
      return res.length > 0;
    });

    let yScale = d3.scaleLinear().domain([0, maxLeftVal]).range([0, height]);

    if (maxLeftVal >= 0 && minLeftVal < 0) {
      yScale = d3
        .scaleLinear()
        .domain([minLeftVal, maxLeftVal])
        .range([0, height]);
    }

    let y = d3
      .scaleLinear()
      .domain([minLeftVal, maxLeftVal])
      .range([height - yScale(minLeftVal), 0]);
    if (maxLeftVal < 0 && minLeftVal < 0) {
      y = d3
        .scaleLinear()
        .domain([minLeftVal, maxLeftVal])
        .range([yScale(maxLeftVal), 0]);
    }

    if (maxLeftVal >= 0 && minLeftVal < 0) {
      y = d3
        .scaleLinear()
        .domain([minLeftVal, maxLeftVal])
        .range([yScale(maxLeftVal), yScale(minLeftVal)]);
    }

    let ticks = y.ticks(7);

    if (ticks[0] > minLeftVal) {
      let diff = ticks[1] - ticks[0];
      minLeftVal = ticks[0] - diff;
      y = d3.scaleLinear().range([height, 0]);
      y.domain([minLeftVal, maxLeftVal]);
      ticks = y.ticks(7);
    }

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

    let yAxis = d3
      .axisLeft(y)
      .tickPadding(10)
      .tickFormat(function (d) {
        return local.miscService.formatNumber(d.toString());
      })
      .tickValues(ticks);

    let YRightAxis: any;
    if (local.ifLineChartDataAvailable) {
      if (local.ifLineChartDataAvailable) {
        this.data.forEach(function (d) {
          d.LineCategory.forEach(function (b: any) {
            b.Date = d.Date;
          });
        });
      }

      let lineFractionValues = this.data.filter(function (d: any) {
        let res = d.LineCategory.filter(function (b: any) {
          return !Number.isInteger(b.Value);
        });
        return res.length > 0;
      });

      let rightMinVal = d3.min(this.data, function (d: any) {
        let minCat: any = d3.min(d.LineCategory, function (b: any) {
          return b.Value;
        });
        return minCat < 0 ? minCat : 0;
      });

      var YLine = d3
        .scaleLinear()
        .range([height, 0])
        .domain([
          rightMinVal,
          d3.max(this.data, function (d: any) {
            let maxCat: any = d3.max(d.LineCategory, function (b: any) {
              return b.Value;
            });
            return maxCat;
          }),
        ]);

      let lineTicks = YLine.ticks(4);

      let lastLineTick = lineTicks[lineTicks.length - 1],
        newLastLineTick = lastLineTick + (lineTicks[1] - lineTicks[0]);

      if (lineFractionValues.length == 0) {
        lineTicks = lineTicks.filter(function (val: number) {
          return Number.isInteger(val);
        });
        lastLineTick = lineTicks[lineTicks.length - 1]
        newLastLineTick = lastLineTick + (lineTicks[1] - lineTicks[0]);
      }

      if (lastLineTick < YLine.domain()[1]) {
        lineTicks.push(newLastLineTick);
        YLine.domain([YLine.domain()[0], newLastLineTick]);
      } else {
        YLine.domain([YLine.domain()[0], lastLineTick]);
      }

      this.divLineTooltip = d3
        .select("body")
        .append("div")
        .attr("id", "divLineTooltip" + timestamp)
        .attr("class", "toolTip");

      YRightAxis = d3.axisRight(YLine).tickValues(lineTicks);

      if (lineFractionValues.length == 0) {
        YRightAxis.tickFormat(d3.format("d"));
      }
    }

    if (this.barColors && this.barColors.length > 0) {
      this.colorRange = this.barColors;
    }
    let hoverColorRange = [
      "#9b9995",
      "#686662",
      "#484744",
      "#6c9923",
      "#addb62",
      "#c8e796",
      "#e4f3cb",
    ];
    if (this.barHoverColors && this.barHoverColors.length > 0) {
      hoverColorRange = this.barHoverColors;
    }

    let color = d3.scaleOrdinal().range(this.colorRange);

    d3.scaleOrdinal().range(hoverColorRange);

    let xAxis = d3.axisBottom(x0);

    this.divTooltip = d3
      .select("body")
      .append("div")
      .attr("id", "divtoolTip" + timestamp)
      .attr("class", "toolTip");

    let svgParent = d3
      .select(this.chartContainer.nativeElement)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    let LegendHolder = svgParent.append("g").attr("class", "legendHolder");

    this.svg = svgParent
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.data.forEach(function (d) {
      d.Categories.forEach(function (b: any) {
        if (
          Categories.findIndex(function (c) {
            return c.Name === b.Name;
          }) == -1
        ) {
          b.Type = "bar";

          Categories.push(b);
        }
      });
    });

    let lineColorRange = [
      "#941868",
      "#6c9923",
      "#484744",
      "#addb62",
      "#65b5eb",
    ];
    if (this.lineColors && this.lineColors.length > 0) {
      lineColorRange = this.lineColors;
    }

    let LineColor = d3.scaleOrdinal().range(lineColorRange);
    let lineData: any;

    if (local.ifLineChartDataAvailable) {
      this.data.forEach(function (d) {
        d.LineCategory.forEach(function (b: any) {
          if (
            Categories.findIndex(function (c) {
              return c.Name === b.Name;
            }) == -1
          ) {
            b.Type = "line";

            Categories.push(b);
          }
        });
      });

      var line = d3
        .line()
        .x(function (d: any) {
          let x0Date: any = x0(d.Date);
          return x0Date + x0.bandwidth() / 2;
        })
        .y(function (d: any) {
          return YLine(d.Value);
        })
        .curve(d3.curveCatmullRom.alpha(0.5));

      lineData = this.DataSegregator(
        this.data.map(function (d) {
          return d.LineCategory;
        }),
        "Name"
      );

      LineColor.domain(
        Categories.filter(function (d) {
          return d.Type == "line";
        }).map(function (d) {
          return d.Name;
        })
      );

      XLine.domain(
        this.data.map(function (d) {
          return d.Date;
        })
      );
    }

    x0.domain(
      this.data.map(function (d) {
        return d.Date;
      })
    );
    x1.domain(
      Categories.filter(function (d) {
        return d.Type == "bar";
      }).map(function (d) {
        return d.Name;
      })
    )
      .rangeRound([0, x0.bandwidth()])
      .paddingOuter(0.4);

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
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-25)");

    this.svg
      .select("g.x-axis")
      .append("text")
      .attr("transform", "translate(" + width / 2 + "," + 40 + ")")
      .attr("dy", "1.71em")
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
    let yAxisLabel;
    if (this.yBarFields.length > 1) yAxisLabel = "Value";
    else yAxisLabel = this.yBarFields[0];

    svgYAxis
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 15 - maxTickWidth)
      .attr("x", 0 - height / 2)

      .attr("dy", "-1.71em")
      .attr("class", "axis-label")
      .style("text-anchor", "middle")
      .text(
        yAxisLabel +
        (local.unit && local.unit.trim() != "" ? " (" + local.unit + ")" : "")
      );

    let bar = this.svg
      .selectAll(".bar")
      .data(local.data)
      .enter()
      .append("g")
      .attr("class", "rect")
      .attr("transform", function (d: any) {
        return "translate(" + x0(d.Date) + ",0)";
      });

    let barWidth = Math.min(x1.bandwidth(), 50);

    bar
      .selectAll("rect")
      .data(function (d: any) {
        return d.Categories;
      })
      .enter()
      .append("rect")
      .attr("class", "dbar")
      .attr("width", barWidth)
      .attr("x", function (d: any) {
        let res = x1(d.Name);
        return res != undefined ? res + x1.bandwidth() / 2 - barWidth / 2 : 0;
      })

      .attr("y", function (d: any) {
        if (d.Value != null) {
          if (minLeftVal < 0 && maxLeftVal < 0) {
            if (y(0) > y(d.Value)) return y(d.Value);
            else return 0;
          } else {
            if (y(0) > y(d.Value)) return y(d.Value);
            else return y(0);
          }
        } else return height;
      })
      .attr("height", function (d: any) {
        if (minLeftVal < 0 && maxLeftVal < 0) {
          if (d.Value != null) return Math.abs(0 - y(d.Value));
          else return 0;
        } else if (minLeftVal < 0 && maxLeftVal >= 0) {
          if (d.Value != null) return Math.abs(y(d.Value) - y(0));
          else return 0;
        } else {
          if (d.Value != null) return Math.abs(y(0) - y(d.Value));
          else return 0;
        }
      })

      .attr("fill", function (_d: any, index: any) {
        return color(index);
      })
      .attr("id", function (_d: any, s: any) {
        return s;
      })
      .on("mouseover", function (_d: any,event:any) {
        d3.select(event.target).style("opacity", 0.8);
      })
      .on("mouseout", function (_d: any,event:any) {
        d3.select(event.target).style("opacity", 1);
      });

    bar.on("mousemove", function (d: any,event:any) {
      local.divTooltip.style("left", event.pageX + 10 + "px");
      local.divTooltip.style("top", event.pageY - 25 + "px");
      local.divTooltip.style("display", "inline-block");
      let elements: any = document.querySelectorAll(":hover");
      let l = elements.length;
      l = l - 1;
      let elementData = elements[l].__data__;

      let formatValue: any;
      if (Number(elementData.Value) < 0) {
        formatValue =
          local.unit == "%"
            ? local.miscService
              .formatNumbertoString(elementData.Value)
              .toString()
              .replace("-", "(") +
            local.unit +
            ")"
            : local.miscService
              .formatNumbertoString(elementData.Value)
              .toString()
              .replace("-", "(" + local.unit) + ")";
      } else formatValue = local.unit == "%" ? local.miscService.formatNumbertoString(elementData.Value) + local.unit : local.unit == "$" ? local.unit + local.miscService.formatNumbertoString(elementData.Value) : local.miscService.formatNumbertoString(elementData.Value);

      local.divTooltip.html(
        elementData.Name +
        (local.unit && local.unit.trim() != ""
          ? " (" + local.unit + ")"
          : "") +
        "<br>" +
        d.Date +
        " : " +
        formatValue
      );
    });

    bar.on("mouseout", function (_d: any) {
      local.divTooltip.style("display", "none");
    });

    if (local.ifLineChartDataAvailable) {
      let svgRightYAxis = this.svg
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(YRightAxis);

      let rightTickNodes = svgRightYAxis.selectAll("g.tick").nodes();
      let maxRightTickWidth = 0;
      if (rightTickNodes.length > 0) {
        maxRightTickWidth = Math.max.apply(
          Math,
          rightTickNodes.map(function (val: any) {
            let text: any = d3.select(val).select("text");
            return text.node().getBoundingClientRect().width;
          })
        );
      }

      svgRightYAxis
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 30 + maxRightTickWidth)
        .attr("x", 0 - height / 2)

        .attr("dy", ".71em")
        .attr("class", "axis-label")
        .style("text-anchor", "middle")
        .text(local.yLineFields[0]);

      lineData.forEach(function (data: any,event:any) {
        data = data.filter(function (ele: any) {
          return ele.Value != null;
        });
        if (data[0] != null && data[0].length != 0) {
          let gLine = local.svg.append("g").attr("name", data[0].Name);

          gLine
            .append("path")
            .attr("class", "line")
            .attr("d", line(data))
            .attr(
              "style",
              "stroke-width: 2px; fill:none; stroke:" + LineColor(data[0].Name)
            )
            .transition()
            .duration(1500);

          gLine
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("cx", function (d: any) {
              let x0Date: any = x0(d.Date);
              return x0Date + x0.bandwidth() / 2;
            })
            .attr("cy", function (d: any) {
              return YLine(d.Value);
            })
            .attr("style", "fill: #f8f9fa; stroke:#1f89ce;")
            .on("mouseover", function (d: any) {
              local.divLineTooltip.style("left", event.pageX + 10 + "px");
              local.divLineTooltip.style("top", event.pageY - 25 + "px");
              local.divLineTooltip.style("display", "inline-block");
              let formatValue: any;
              if (Number(d.Value) < 0) {
                formatValue =
                  local.miscService
                    .formatNumbertoString(d.Value)
                    .toString()
                    .replace("-", "(") + "%)";
              } else formatValue = local.miscService.formatNumbertoString(d.Value);

              local.divLineTooltip.html(
                data[0].Name + "</br>" + d.Date + " : " + formatValue
              );
            })
            .on("mouseout", function (_d: any) {
              local.divLineTooltip.style("display", "none");
            });
        }
      });
    }


    svgParent
      .select(".legendHolder")
      .attr("transform", function (_d: any, i: any, n: any) {
        let thisWidth = d3.select(n[i]).node().getBBox().width;
        return "translate(" + (width / 2 - thisWidth / 3) + ",0)";
      });
  }
  SetText(local: any): string {
    return local.yLineFields?.length > 0 ? local.yLineFields[0] : "";
  }
}

