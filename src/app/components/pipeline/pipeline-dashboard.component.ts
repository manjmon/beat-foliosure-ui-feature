import { Component, OnInit } from '@angular/core';
import { PipelineService } from '../../services/pipeline.service';
@Component({
  selector: 'app-pipeline-dashboard',
  templateUrl: './pipeline-dashboard.component.html',
  styleUrls: ['./pipeline-dashboard.component.scss']
})
export class PipelineDashboardComponent implements OnInit {
  data: any = {};
  isLoader:boolean=false;
  width:number = 0;
  constructor(private _pipeline: PipelineService) { }

  ngOnInit(): void {
    this.getDashBoardGraphs();
  }
  getDashBoardGraphs() {
    this.isLoader=true;
    this._pipeline.getPipeLineDashBoard().subscribe((x: any) => {
      this.data = x;
      this.isLoader=false;
    });
  }

  onResized(event: any) {
    this.width = event?.newRect?.width;
  }
}
