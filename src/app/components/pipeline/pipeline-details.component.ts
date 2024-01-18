import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountService } from "../../services/account.service";
import { FeaturesEnum } from "../../services/permission.service";
import { PipelineService } from "../../services/pipeline.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";


@Component({
	selector: 'pipeline-details',
	styleUrls:['./pipeline-details.component.scss'],
	templateUrl: './pipeline-details.component.html'
})


export class PipelineDetailsComponent implements OnInit {
	feature: typeof FeaturesEnum = FeaturesEnum;	
	id: any;	
	model: any = {};	
	loading = false;	
	msgTimeSpan: any;
	constructor(
		private miscService: MiscellaneousService,private accountService: AccountService,  private _pipelineService: PipelineService,
		 private _avRoute: ActivatedRoute) {
		if (this._avRoute.snapshot.params["id"]) {
			this.id = this._avRoute.snapshot.params["id"];
		}
	}
	ngOnInit() {
		if (this.id != undefined) {
			this.getPipelineDetails();
		}
	}

	getPipelineDetails() {
		this.loading = true;
		this._pipelineService.getPipelineById({ Value: this.id })
			.subscribe({next:result => {
				this.model = result;
				if(document.getElementById("HeaderNameID")){
					this.miscService.getTitle(this.model?.name);
				}
				localStorage.setItem("headerName", this.model.name);
				this.loading = false;
			}, error:error => {
				this.loading = false;
			}});
	}
	

}