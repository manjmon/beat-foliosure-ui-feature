import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ConfirmationService, MessageService, Message } from "primeng/api";
import { AccountService } from "./../../services/account.service";
import {MiscellaneousService} from "./../../services/miscellaneous.service";
import { ActivatedRoute } from "@angular/router";


@Component({
    selector: 'save-kpi',
    templateUrl: './save-kpi.component.html',
    providers: [MessageService, ConfirmationService]

})


export class SaveKPIComponent implements OnInit {
    id: any;
    msgTimeSpan: number;
    msgs: Message[] = [];
    title: string = "Create";
    resetText: string = "Reset";
    pagerLength: any;
    model: any = {};
    finalModel: any = {};
   kpiTypes: any;
   sectorList: any;
   portfolioCompanyList:any;
   parentKPIList:any;
   loading = false;
   kpiType:string;
   selectedKPI:any;
   forUpdate:boolean=false;
    constructor(private accountService: AccountService, private _avRoute: ActivatedRoute, protected changeDetectorRef: ChangeDetectorRef, private miscService: MiscellaneousService) {
       
        if (this._avRoute.snapshot.params["id"]) {
            this.id = this._avRoute.snapshot.params["id"];
            this.title = "Update";
            this.resetText = "Reload";
            this.forUpdate=true;
            if (this._avRoute.snapshot.params["type"]) {
                this.kpiType=this._avRoute.snapshot.params["type"];
                }
        }
        

        this.kpiTypes = [{type:"Financial"},{type:"Operational"},{type:"Sector"},{type:"Company"}];
        this.msgTimeSpan = this.miscService.getMessageTimeSpan();
        this.pagerLength = this.miscService.getPagerLength();
    }

    ngOnInit() {
        this.miscService.getSectorList().subscribe({
            next: result => {
                this.sectorList = result.body;  
            },
            error: _error => {
            }
        });       
        this.setDefaultValues();
    }

    private getSubKPIList(portfolioCompanyID:any) {
        this.miscService.getCompanySubKpiList(portfolioCompanyID).subscribe({
            next: result => {
                this.parentKPIList = result.body.companywiseKPIList;
            },
            error: _error => {
            }
        });
    }

    onCompanyChange() {
        this.model.parentKPIDetails=null;
		this.getSubKPIList(this.model.portfolioCompanyDetails.portfolioCompanyID);		
		
	}


    private getCompanyList(){
        if(this.id!=undefined)
        {
            this.miscService.getPortfolioCompanyList({}).subscribe({
                next: result => {
                    let resp = result;
                    if (resp != null && resp.code == "OK") {
                        this.portfolioCompanyList = resp.body.portfolioCompanyList;
                        this.getCompanywiseKpiById();
                    }
                },
                error: _error => {
                }
            });
        }
    else {
        this.miscService.getPortfolioCompanyList({}).subscribe({
            next: result => {
                let resp = result;
                if (resp != null && resp.code == "OK") {
                    this.portfolioCompanyList = resp.body.portfolioCompanyList;
                }
            },
            error: _error => {
            }
        });
    }
    }
    onKPIChange()
    {
        this.kpiType=this.model.kpiType.type;
        if(this.model.kpiType.type=="Company")
       {
       this.getSubKPIList(0);
       }
    }
    setDefaultValues() {
        if(this.selectedKPI!=null)
        {
         this.model.kpiType=this.selectedKPI;
         this.model.kpiType.type=this.selectedKPI.type;
         this.kpiType=this.selectedKPI.type;
         this.onKPIChange();
        }
		if (this.id != undefined) {
			this.loading = true;
			this.title = "Update";
			 if(this.kpiType=="Financial"){
                this.getFinancialKpiById();
             }
             else if(this.kpiType=="Operational"){
                this.getOperationalKpiById();
         }
             else if(this.kpiType=="Sector"){
                    this.getSectorwiseKpiById();
             }
             else if(this.kpiType=="Company"){

                this.getCompanyList();
         }
			
		}
		 
	}

    getFinancialKpiById(){
        
        let local=this;
        this.miscService.getFinancialKpiById(this.id)
				.subscribe(result => {
					let resp = result ; 
					if (resp != null && resp.code == "OK") {
						this.model = resp.body;
							this.model.kpiType= this.kpiTypes.filter(function (element: any, _index: any) { return element.type == local.kpiType })[0];
					}
					else {
						if (resp != null && resp.message!= "") {

							this.msgs = this.miscService.showAlertMessages('error', resp.message);
						}
					}
					//when No record found or something went wrong						
					this.loading = false;
				}, _error => {
					this.loading = false;
				});
    }

    getOperationalKpiById(){
        
        let local=this;
        this.miscService.getOperationalKpiById(this.id)
				.subscribe(result => {
					let resp = result ; 
					if (resp != null && resp.code == "OK") {
						this.model = resp.body;
							this.model.kpiType= this.kpiTypes.filter(function (element: any, _index: any) { return element.type == local.kpiType })[0];
					}
					else {
						if (resp != null && resp.message!= "") {

							this.msgs = this.miscService.showAlertMessages('error', resp.message);
						}
					}
					//when No record found or something went wrong						
					this.loading = false;
				}, _error => {
					this.loading = false;
				});
    }

    getSectorwiseKpiById(){
        let local=this;
        this.miscService.getSectorwiseKpiById(this.id)
				.subscribe({next:result => {
					let resp = result ; 
					if (resp != null && resp.code == "OK") {
						this.model = resp.body;
                        this.model.kpiType= this.kpiTypes.filter(function (element: any, _index: any) { return element.type == local.kpiType })[0];
                        if (this.model.sector != null && this.model.sector.sectorID > 0) {
                            this.model.sectorDetail = this.sectorList.filter(function (element: any, _index: any) { return element.sectorID == local.model.sector.sectorID; })[0];
                        }
					}
					else {
						if (resp != null && resp.message!= "") {

							this.msgs = this.miscService.showAlertMessages('error', resp.message);
						}
					}
					//when No record found or something went wrong						
					this.loading = false;
				}, error:_error => {
					this.loading = false;
				}});
    }

    getCompanywiseKpiById(){
        let local=this;

        this.miscService.getCompanyKpiById(this.id)
				.subscribe({next:result => {
					let resp = result ; 
					if (resp != null && resp.code == "OK") {
						this.model = resp.body;
                        this.model.kpiType= this.kpiTypes.filter(function (element: any, _index: any) { return element.type == local.kpiType })[0];
                            this.parentKPIList=this.model.companywiseKPIListModelChild.companywiseKPIList;
                             this.model.parentKPIDetails=this.parentKPIList.filter(function (element: any, _index: any) { return element.companywiseKPIID == local.model.parentKPIID; })[0];
                   }
					else {
						if (resp != null && resp.message!= "") {

							this.msgs = this.miscService.showAlertMessages('error', resp.message);
						}
					}
					//when No record found or something went wrong						
					this.loading = false;
				},error: _error => {
					this.loading = false;
				}});
    }


    createModelForSaveKPI(f: any) {
        this.loading = true;
        let finacialModel:any;
        let operationalModel:any;
        let sectorwiseModel:any;
        let companywiseModel:any;
        if (f.valid) {
           
            if (this.title == "Create") {

                if(this.model.kpiType.type=="Sector"){
                    sectorwiseModel={sector:this.model.sectorDetail,kpi:this.model.kpi,description:this.model.description};
                }
                else if(this.model.kpiType.type=="Company"){
                    companywiseModel={portfolioCompany:null,kpi:this.model.kpi,parentKPIID:this.model.parentKPIDetails!=undefined?this.model.parentKPIDetails.companywiseKPIID:0,description:this.model.description};
                }
                else if(this.model.kpiType.type=="Operational"){
                    operationalModel={kpi:this.model.kpi,description:this.model.description};
                }
                else{
                  finacialModel={kpi:this.model.kpi,description:this.model.description};
                }
    
                this.finalModel={
                        kpiType:this.model.kpiType.type,
                        financialKPIDetails:finacialModel,
                        operationalKPIDetails:operationalModel,
                        sectorwiseKPIDetails:sectorwiseModel,
                        companywiseKPIDetails:companywiseModel
                };
            }
            else if (this.title == "Update") {
                if(this.model.kpiType.type=="Sector"){
                    sectorwiseModel={sector:this.model.sectorDetail,kpi:this.model.kpi,description:this.model.description,sectorwiseKPIID:this.model.sectorwiseKPIID};
                }
                else if(this.model.kpiType.type=="Operational"){
                   operationalModel={kpi:this.model.kpi,description:this.model.description,operationalKPIId:this.model.operationalKPIId};
                  }
                  else if(this.model.kpiType.type=="Company"){
                    companywiseModel={portfolioCompany:null,kpi:this.model.kpi,parentKPIID:this.model.parentKPIDetails!=undefined?this.model.parentKPIDetails.companywiseKPIID:0,description:this.model.description,companywiseKPIID:this.model.companywiseKPIID};
                   }
                else{
                  finacialModel={kpi:this.model.kpi,description:this.model.description,financialKPIId:this.model.financialKPIId};
                }
    
                this.finalModel={
                        kpiType:this.model.kpiType.type,
                        financialKPIDetails:finacialModel,
                        operationalKPIDetails:operationalModel,
                        sectorwiseKPIDetails:sectorwiseModel,
                        companywiseKPIDetails:companywiseModel
                };                
            }

            if(this.model.kpiType.type=="Company" && companywiseModel.parentKPIID==companywiseModel.companywiseKPIID)
            {
                 this.loading = false;
            }
            else
            {
            this.saveKPI(this.finalModel,f);
            }
        }
    }
saveKPI(_model:any,form:any){
    this.selectedKPI=this.model.kpiType;
    this.miscService.saveKPI(this.finalModel)
    .subscribe({
        next:data => {

            if (data.code == "OK" && this.title == "Create") {
               this.formReset(form);
            }
            else if (data.code == "OK" && this.title == "Update"){
            this.formReset(form);
            }
            this.loading = false;
            this.msgs = this.miscService.showAlertMessages(data.code == 'OK' ? 'success' : 'error', data.message);
        },
        error:error => {
            this.loading = false;
            this.msgs = this.miscService.showAlertMessages('error', error.message);

        }});
}
    formReset(f: any) {
        f.resetForm();
        this.changeDetectorRef.markForCheck();
        f.controls['kpitype'].setValue(this.selectedKPI);

        this.setDefaultValues();
    }
}