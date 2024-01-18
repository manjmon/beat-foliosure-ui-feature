import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import * as d3 from "d3";
import { secureRandom  } from 'src/app/common/constants';

@Component({
  selector: "app-bubble-chart",
  template: `
    <h2>Bubble Chart</h2>
    <div #divBubbleChart></div>
  `,
})
export class BubbleChartComponent implements OnInit {
  @ViewChild("divBubbleChart") chartContainer: ElementRef;

  @Input() data: any[];
  @Input() colours: Array<string>;

  svg: any;
  opacity: any;

  constructor(private elRef: ElementRef) {}

  ngOnInit() {
    this.createChart();
  }
  createChart() {
    let height = 400;
    let width = 600;
    let margin = 40;
    let data = [];
    for (let i = 0; i < 42; i++) {
      data.push({
        x: secureRandom(4000),
        y: secureRandom(1000),
        c: Math.round(secureRandom(50)),
        size: secureRandom(2000),
      });
    }

    let labelX = "X";
    let labelY = "Y";
    this.svg = d3
      .select(this.chartContainer?.nativeElement)
      .append("svg")
      .attr("class", "chart")
      .attr("width", width + margin + margin)
      .attr("height", height + margin + margin)
      .append("g")
      .attr("transform", "translate(" + margin + "," + margin + ")");

    let dxMin = d3.min(data, function (d) {
      return d.x;
    });
    let dyMax = d3.max(data, function (d) {
      return d.y;
    });
    let dxMax = d3.max(data, function (d) {
      return d.x;
    });
    let dyMin = d3.min(data, function (d) {
      return d.y;
    });
    let dSizeMin = d3.min(data, function (d) {
      return d.size;
    });
    let dSizeMax = d3.max(data, function (d) {
      return d.size;
    });

    let x = d3
      .scaleLinear()
      .domain([dxMin != undefined ? dxMin : 0, dxMax != undefined ? dxMax : 0])
      .range([0, width]);

    let y = d3
      .scaleLinear()
      .domain([dyMin != undefined ? dyMin : 0, dyMax != undefined ? dyMax : 0])
      .range([height, 0]);

    let scale = d3
      .scaleSqrt()
      .domain([
        dSizeMin != undefined ? dSizeMin : 0,
        dSizeMax != undefined ? dSizeMax : 0,
      ])
      .range([1, 20]);

    this.opacity = d3
      .scaleSqrt()
      .domain([
        dSizeMin != undefined ? dSizeMin : 0,
        dSizeMax != undefined ? dSizeMax : 0,
      ])
      .range([1, 0.5]);

    let color = d3.schemeCategory10.concat(
      d3.schemeSet1
        .concat(d3.schemeSet2)
        .concat(d3.schemeSet3)
        .concat(d3.schemeAccent)
    );

    let xAxis = d3.axisBottom(x);
    let yAxis = d3.axisLeft(y);

    this.svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 20)
      .attr("y", -margin)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(labelY);
    this.svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("x", width + 20)
      .attr("y", margin - 10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(labelX);

    let local = this;

    this.svg
      .selectAll("circle")
      .data(data)
      .enter()
      .insert("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("opacity", function (d: any) {
        return local.opacity(d.size);
      })
      .attr("r", function (d: any) {
        return scale(d.size);
      })
      .style("fill", function (d: any) {
        return color[d.c];
      })
      .on("mouseover", function (d: any) {
        local.fade(d.c, 0.1);
      })
      .on("mouseout", function () {
        local.fadeOut();
      })
      .transition()
      .delay(function (d: any) {
        return x(d.x) - y(d.y);
      })
      .duration(500)
      .attr("cx", function (d: any) {
        return x(d.x);
      })
      .attr("cy", function (d: any) {
        return y(d.y);
      })
      .ease(d3.easeBounce);
  }

  fade(c: any, opacity: any) {
    this.svg
      .selectAll("circle")
      .filter(function (d: any) {
        return d.c != c;
      })
      .transition()
      .style("opacity", opacity);
  }

  fadeOut() {
    let local = this;
    this.svg
      .selectAll("circle")
      .transition()
      .style("opacity", function (d: any) {
        local.opacity(d.size);
      });
  }
}
