import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import * as d3 from "d3";
import * as Highcharts from "highcharts";
import * as HC_exporting_ from "highcharts/modules/exporting";
import { MiscellaneousService } from "../../services/miscellaneous.service";
const HC_exporting = HC_exporting_;
declare let $: any;
@Component({
  selector: "app-multiline-point-chart",
  template: `
    <div class="chart-wrapper" #divLineChart id="divmultilinePointChart"></div>
  `,
  //styleUrls: ['./chart.css']
})
export class MultilinePointChartComponent implements OnInit, OnChanges {
  @ViewChild("divLineChart",{static: true}) chartContainer: ElementRef;

  @Input() data: any[];
  @Input() colours: Array<string>;
  @Input() xColumn: string;
  @Input() yObjects: any;
  @Input() axisLabels: any;
  @Input() width: any=null;
  @Input() isDisplay:number;
  @Input() yFontSize =null;
  @Input() xFontSize =null;
  @Input() markerFontSize =null;
  @Input() height =null;
  constructor(
    private elRef: ElementRef,
    private miscService: MiscellaneousService
  ) {}

  ngOnInit() {
     this.createHightChart();
  }
  ngOnChanges(changed:SimpleChanges) {
    
    if (this.isDisplay) {
      Highcharts.charts.forEach(function(chart) {
        chart?.reflow();
      });
    }
  }

  createHightChart() {
    let local = this;
    let arrCategories: any[] = [];
    let arrSeries: any[] = [];
    if (this.data === undefined) this.data = [];
    this.data.forEach(function (val, i) {
      let date = new Date(val[local.xColumn]);
      let quarter =
        "Q" +
        Math.floor(local.miscService.getQuarter(date)) +
        " " +
        date.getFullYear();
      arrCategories.push(quarter);
    });
if(this.yObjects===undefined) this.yObjects={};
    let keys: any[] = Object.keys(this.yObjects);
    let arrMaxTVPI: any[] = [];
    let arrMaxIRR: any[] = [];
    let irrData: any[] = [];
    let tvpiData: any[] = [];
    for (let i = 0, l = this.data.length; i < l; i++) {
      let key = Object.keys(this.data[i]);
      for (let j = 0, k = key.length; j < k; j++) {
        if(keys[j]=='Gross TVPI')
        {
          tvpiData.push(this.data[i]['Gross TVPI']);
        }
        if(keys[j]=='Net TVPI')
        {
          tvpiData.push(this.data[i]['Net TVPI']);
        }
        if(keys[j]=='Gross IRR')
        {
          irrData.push(this.data[i]['Gross IRR']);
        }
        if(keys[j]=='Net IRR')
        {
          irrData.push(this.data[i]['Net IRR']);
        }
      }
    }
    arrMaxTVPI.push(...tvpiData);
    arrMaxIRR.push(...irrData);
    for (let index = 0; index < keys.length; index++) {
      let data: any[] = [];
      this.data.forEach(function (val, i) {
        data.push(val[keys[index]]);
      });
      let colorArray = [
        "#3498DB",
        "#78C020",
        "#FFA000",
        "#000000"
      ];
      arrSeries.push({
        name: keys[index],
        type: "spline",
        yAxis: (index == 0 || index == 2) ? 1 : 0,
        data: data,
        color: colorArray[index],
        tooltip: {
          valueSuffix: (keys[index] == "Gross IRR" || keys[index] == "Net IRR")  ? " %" : " x",
        },
      });
    }

    //Calculating Min and Max Value
    let cht = Highcharts.chart( {
      chart: {
        // zoomType: "xy",
        renderTo: this.chartContainer.nativeElement,
        width:this.width,
        style:{
          fontSize: this.xFontSize!=null?this.xFontSize:"18px",
          fontFamily: "Helvetica",
          fontWeight:"normal"
        },
        marginTop:25,
        height:this.height!=null?this.height:400
      },   
      accessibility: {
        enabled: false
      },  
      title: {
        text: "",
        style:{
          fontSize: this.xFontSize!=null?this.xFontSize:"18px",
          fontFamily: "Helvetica"
        }
      },
      xAxis: [
        {
          categories: arrCategories,
          // crosshair: true,
          crosshair: { width: 2, color: "steelblue", dashStyle: "Dot" },
          labels:{
            style:{
              fontSize: this.xFontSize!=null?this.xFontSize:"18px",
            fontFamily: "Helvetica"
            }
          }
        },
      ],
      yAxis: [
        {
          margin:10,
         // max:irrMax,
          //min:0,
          labels:{

            style:{
              fontSize: this.markerFontSize!=null?this.markerFontSize:"18px",
              fontFamily: "Helvetica",
            padding:'10px'
            }
          },
          // Primary yAxis
          title: {
            text: "IRR",
            style:{
              fontSize: this.markerFontSize!=null?this.markerFontSize:"18px",
              fontFamily: "Helvetica",
            padding:'10px'
            }
          },
        },
        {
          // Secondary yAxis
         // max:tvpiMax,
          //min:0,
          title: {
            text: "TVPI",
            rotation: 270,
            style:{
              fontSize: this.markerFontSize!=null?this.markerFontSize:"18px",
              fontFamily: "Helvetica",
            padding:'10px'
            },
            margin:25
          },
          labels:{
            style:{
              fontSize: this.markerFontSize!=null?this.markerFontSize:"18px",
              fontFamily: "Helvetica",
            padding:'10px'
            }
          },
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
        valueDecimals:1
      },
      legend: {
        align: "center",
        verticalAlign: "bottom",
        x: 0,
        y: 0,
        itemStyle:
        {
          fontSize: this.xFontSize!=null?this.xFontSize:"18px",
          fontFamily: "Helvetica",
          fontWeight:"normal",
        
        }
      },
      series: arrSeries,
      credits: {
        enabled: false,
      },
    });

    function addChartCrosshairs() {
      let chart = this;
      //initialize the X and Y component of the crosshairs (you can adjust the color and size of the crosshair lines here)
      let crosshairX = chart.renderer
        .path([
          "M",
          chart.plotLeft,
          0,
          "L",
          chart.plotLeft + chart.plotWidth,
          0,
        ])
        .attr({
          stroke: "black",
          "stroke-width": 1,
          zIndex: 0,
        })
        .add()
        .toFront()
        .hide();

      let crosshairY = chart.renderer
        .path(["M", 0, chart.plotTop, "L", 0, chart.plotTop + chart.plotHeight])
        .attr({
          stroke: "black",
          "stroke-width": 1,
          zIndex: 0,
        })
        .add()
        .toFront()
        .hide();

      $(chart.container).mousemove(function (event) {
        //onmousemove move our crosshair lines to the current mouse postion
        crosshairX.translate(0, event.offsetY);
        crosshairY.translate(event.offsetX, 0);

        //only show the crosshairs if we are inside of the plot area (the area within the x and y axis)
        if (
          event.offsetX > chart.plotLeft &&
          event.offsetX < chart.plotLeft + chart.plotWidth &&
          event.offsetY > chart.plotTop &&
          event.offsetY < chart.plotTop + chart.plotHeight
        ) {
          crosshairY.show();
        } else {
          crosshairX.hide();
          crosshairY.hide();
        }
      });
    }
  }

  makeLineChart(
    dataset: any[],
    xName: any,
    yObjs: any,
    axisLables: any,
    local: any
  ) {
    let chartObj: any = {};
    let colorArray = ["rgb(0,50,100)", "rgb(245,140,60)", "rgb(210,15,70)"];  
    let color = d3.scaleOrdinal(colorArray);
    chartObj.xAxisLable = axisLables.xAxis;
    chartObj.yAxisLable = axisLables.yAxis;
    chartObj.yAxisRightLable = axisLables.yAxisRight;
    /*
		 yObjsects format:
		 {y1:{column:'',name:'name',color:'color'},y2}
		 */

    chartObj.data = dataset;
    chartObj.margin = { top: 15, right: 60, bottom: 30, left: 50 };
    chartObj.width = 650 - chartObj.margin.left - chartObj.margin.right;
    chartObj.height = 300 - chartObj.margin.top - chartObj.margin.bottom;

    // So we can pass the x and y as strings when creating the function
    chartObj.xFunct = function (d: any) {
      return new Date(d[xName]);
    };

    // For each yObjs argument, create a yFunction
    function getYFn(column: any) {
      return function (d: any) {
        return d[column];
      };
    }

    // Object instead of array
    chartObj.yFuncts = [];
    for (let y in yObjs) {
      yObjs[y].name = y;
      yObjs[y].yFunct = getYFn(yObjs[y].column); //Need this  list for the ymax function
      chartObj.yFuncts.push(yObjs[y].yFunct);
    }

    //Formatter functions for the axes
    chartObj.formatAsDate = d3.timeFormat("%b %Y");
    chartObj.formatAsNumber = d3.format(".0f");
    chartObj.formatAsDecimal = d3.format(".1f");
    chartObj.formatAsCurrency = d3.format("$.1f");
    chartObj.formatAsYear = d3.format("");
    chartObj.formatAsFloat = function (d: any) {
      if (d % 1 !== 0) {
        return d3.format(".1f")(d);
      } else {
        return d3.format(".0f")(d);
      }
    };
    chartObj.formatAsQuarter = function (d: any) {
      let date = new Date(d);
      return (
        "Q" +
        Math.floor(local.miscService.getQuarter(date)) +
        " " +
        date.getFullYear()
      );
    };

    chartObj.xFormatter = chartObj.formatAsQuarter;
    chartObj.yFormatter = chartObj.formatAsDecimal;
    chartObj.yRightFormatter = chartObj.formatAsNumber;

    chartObj.bisectYear = d3.bisector(chartObj.xFunct).left; //< Can be overridden in definition

    let extent: any = d3.extent(chartObj.data, chartObj.xFunct);

    let scaleValues: any[] = [];
    chartObj.data.forEach(function (d: any) {
      scaleValues.push(chartObj.xFunct(d));
    }); 
    chartObj.xScale = d3
      .scaleLinear()
      .domain(extent)
      .range([0, chartObj.width]);
    chartObj.max = function (fn: any) {
      return d3.max(chartObj.data, fn);
    };
    chartObj.min = function (fn: any) {
      return d3.min(chartObj.data, fn);
    };
    let max: any = d3.max(chartObj.yFuncts.map(chartObj.max));
    let min: any = d3.min(chartObj.yFuncts.map(chartObj.min));
    chartObj.yScale = d3
      .scaleLinear()
      .range([chartObj.height, 0])
      .domain([0, max]);
    chartObj.yScaleLeft = d3
      .scaleLinear()
      .range([chartObj.height, 0])
      .domain([0, min]);

    //Create axis
    chartObj.xAxis = d3
      .axisBottom(chartObj.xScale)
      .tickFormat(chartObj.xFormatter)
      .tickValues(scaleValues)
      .ticks(scaleValues.length); //< Can be overridden in definition

    chartObj.yAxis = d3
      .axisLeft(chartObj.yScale)
      .tickFormat(chartObj.yFormatter); //< Can be overridden in definition
    chartObj.yRightAxis = d3
      .axisRight(chartObj.yScale)
      .tickFormat(chartObj.yFormatter);
    // Build line building functions
    function getYScaleFn(yObj: any) {
      return function (d: any) {
        return chartObj.yScale(yObjs[yObj].yFunct(d));
      };
    }
    for (let yObj in yObjs) {
      yObjs[yObj].line = d3
        .line()
        .x(function (d: any) {
          return chartObj.xScale(chartObj.xFunct(d));
        })
        .y(getYScaleFn(yObj))
        .curve(d3.curveCatmullRom.alpha(0.5));
    }

    chartObj.svg;

    // Change chart size according to window size
    chartObj.update_svg_size = function () {
      chartObj.width =
        parseInt(chartObj.chartDiv.style("width"), 10) -
        (chartObj.margin.left + chartObj.margin.right);

      chartObj.height =
        parseInt(chartObj.chartDiv.style("height"), 10) -
        (chartObj.margin.top + chartObj.margin.bottom);
      
      /* Update the range of the scale with new width/height */
      chartObj.xScale.range([0, chartObj.width]);

      chartObj.yScale.range([chartObj.height, 0]);

      if (!chartObj.svg) {
        return false;
      }

      /* Else Update the axis with the new scale */
      chartObj.svg
        .select(".x.axis")
        .attr("transform", "translate(0," + chartObj.height + ")")
        .call(chartObj.xAxis);
      chartObj.svg.select(".x.axis .label").attr("x", chartObj.width / 2);

      chartObj.svg.select(".y.axis").call(chartObj.yAxis);
      chartObj.svg.select(".y.axis .label").attr("x", -chartObj.height / 2);

      chartObj.svg
        .select("g.grid")
        .call(chartObj.make_y_gridlines().tickSize(-chartObj.width))
        .selectAll("text")
        .remove();

      /* Force D3 to recalculate and update the line */
      for (let y in yObjs) {
        yObjs[y].path.attr("d", yObjs[y].line);
      }

      d3.selectAll(".focus.line").attr("y2", chartObj.height);

      chartObj.chartDiv
        .select("svg")
        .attr(
          "width",
          chartObj.width + (chartObj.margin.left + chartObj.margin.right)
        )
        .attr(
          "height",
          chartObj.height + (chartObj.margin.top + chartObj.margin.bottom)
        );

      chartObj.svg
        .select(".overlay")
        .attr("width", chartObj.width)
        .attr("height", chartObj.height);
      return chartObj;
    };

    chartObj.bind = function (selector: any) {
      chartObj.mainDiv = d3.select(selector);
      // Add all the divs to make it centered and responsive
      chartObj.mainDiv
        .append("div")
        .attr("class", "inner-wrapper")
        .append("div")
        .attr("class", "outer-box")
        .append("div")
        .attr("class", "inner-box");
      let chartSelector = selector + " .inner-box";
      chartObj.chartDiv = d3.select(chartSelector);
      d3.select(window).on("resize." + chartSelector, chartObj.update_svg_size);
      chartObj.update_svg_size();
      return chartObj;
    };

    chartObj.make_y_gridlines = function () {
      return d3.axisLeft(chartObj.yScale);
    };

    // Render the chart
    chartObj.render = function () {
      //Create SVG element
      //chartObj.svg = chartObj.chartDiv.append("svg").attr("class", "chart-area").attr("width", chartObj.width + (chartObj.margin.left + chartObj.margin.right)).attr("height", chartObj.height + (chartObj.margin.top + chartObj.margin.bottom)).append("g").attr("transform", "translate(" + chartObj.margin.left + "," + chartObj.margin.top + ")");
      chartObj.svg = chartObj.chartDiv
        .append("svg")
        .attr("class", "chart-area")
        .attr(
          "width",
          chartObj.width + (chartObj.margin.left + chartObj.margin.right)
        )
        .attr(
          "height",
          chartObj.height + 10 + (chartObj.margin.top + chartObj.margin.bottom)
        )
        .append("g")
        .attr(
          "transform",
          "translate(" + chartObj.margin.left + "," + chartObj.margin.top + ")"
        );
      // gridlines in y axis function

      // add the Y gridlines
      chartObj.svg
        .append("g")
        .attr("class", "grid")
        .call(chartObj.make_y_gridlines().tickSize(-chartObj.width))
        .selectAll("text")
        .remove();

      // Draw Lines
      for (let y in yObjs) {
        yObjs[y].path = chartObj.svg
          .append("path")
          .datum(chartObj.data)
          .attr("class", "line")
          .attr("d", yObjs[y].line)
          .style("stroke", color(y))
          .attr("data-series", y)
          .on("mouseover", function () {
            focus.style("display", null);
          })
          .on("mouseout", function () {
            focus.transition().delay(700).style("display", "none");
          })
          .on("mousemove", mousemove);
      }

      // Draw Axis
      chartObj.svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chartObj.height + ")")
        .call(chartObj.xAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", chartObj.width / 2)
        .attr("y", 40)
        .style("text-anchor", "middle")
        .text(chartObj.xAxisLable);

      chartObj.svg
        .append("g")
        .attr("class", "y axis")
        .call(chartObj.yAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -42)
        .attr("x", -chartObj.height / 2)
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .text(chartObj.yAxisLable);

      chartObj.svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + chartObj.width + ",0)")
        .call(chartObj.yRightAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 40)
        .attr("x", -chartObj.height / 2)
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .text(chartObj.yAxisRightLable);

      //Draw tooltips
      let focus = chartObj.svg
        .append("g")
        .attr("class", "focus")
        .style("display", "none");

      for (let y in yObjs) {
        yObjs[y].tooltip = focus.append("g");
        yObjs[y].tooltip.append("circle").attr("r", 5);
        yObjs[y].tooltip.append("text").attr("x", 9).attr("dy", ".35em");
      }

      // Year label
      focus
        .append("text")
        .attr("class", "focus year")
        .style("fill", "#1e28a0")
        .style("font-size", "1em")
        .attr("x", 9)
        .attr("y", 0);
      // Focus line
      focus
        .append("line")
        .attr("class", "focus line")
        .attr("y1", 0)
        .attr("y2", chartObj.height);

      //Draw legend
      let legend = chartObj.mainDiv.append("div").attr("class", "legend");
      for (let y in yObjs) {
        let series = legend.append("div");
        series
          .append("div")
          .attr("class", "series-marker")
          .style("background-color", color(y));
        series.append("p").text(y);
        yObjs[y].legend = series;
      }

      // Overlay to capture hover
      chartObj.svg
        .append("rect")
        .attr("class", "overlay")
        .attr("width", chartObj.width)
        .attr("height", chartObj.height)
        .on("mouseover", function () {
          focus.style("display", null);
        })
        .on("mouseout", function () {
          focus.style("display", "none");
        })
        .on("mousemove", mousemove);

      return chartObj;
      function mousemove() {
        let x0 = chartObj.xScale.invert(d3.pointer(event.target)[0]),
          i = chartObj.bisectYear(dataset, x0, 1),
          d0 = chartObj.data[i - 1],
          d1 = chartObj.data[i];
        try {
          var d = x0 - chartObj.xFunct(d0) > chartObj.xFunct(d1) - x0 ? d1 : d0;
        } catch (e) {
          return;
        }
        let minY = chartObj.height;
        for (let y in yObjs) {
          yObjs[y].tooltip.attr(
            "transform",
            "translate(" +
              chartObj.xScale(chartObj.xFunct(d)) +
              "," +
              chartObj.yScale(yObjs[y].yFunct(d)) +
              ")"
          );
          let tooltipText = chartObj.yFormatter(yObjs[y].yFunct(d));
          yObjs[y].tooltip.select("text").text(tooltipText);
          minY = Math.min(minY, chartObj.yScale(yObjs[y].yFunct(d)));
        }

        focus
          .select(".focus.line")
          .attr(
            "transform",
            "translate(" + chartObj.xScale(chartObj.xFunct(d)) + ")"
          )
          .attr("y1", minY);
        focus
          .select(".focus.year")
          .text("Quarter: " + chartObj.xFormatter(chartObj.xFunct(d)));
      }
    };
    return chartObj;
  }
}
