import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Message } from "primeng/api/message";
import { MessageService } from "primeng/api";
import { FirmService } from "../../services/firm.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { PipelineService } from "../../services/pipeline.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";


@Component({
    selector: 'pipeline',
    styleUrls: ['./add-pipeline.component.scss'],
    templateUrl: './add-pipeline.component.html',
    providers: [MessageService]

})
export class AddPipelineComponent implements OnInit {
    title: string = "Create";
    resetText: string = "Reset";
    id: string;
    msgTimeSpan: number;
    msgs: Message[] = [];
    masterModel: any = {};
    model: any = {};
    loading: boolean = false;
    yearRange: string = "";
    today: Date;
    form: FormGroup;
    submitted: boolean = false;
    @ViewChild(ToastContainerDirective, {})
    toastContainer: ToastContainerDirective;
    sourceURL: any;
    accountTypeLoading: boolean = false;
    strategyLoading: boolean;
    firmLoading: boolean;
    statusLoading: boolean;
    sideNavWidth:any ="";
    constructor(private pipelineService: PipelineService, private formBuilder: FormBuilder, private toastrService: ToastrService,
        private firmService: FirmService, protected changeDetectorRef: ChangeDetectorRef, private _avRoute: ActivatedRoute, private miscService: MiscellaneousService,
    ) {
        if (this._avRoute.snapshot.params["id"]) {
            this.id = this._avRoute.snapshot.params["id"];
            this.loading = true;
            this.title = "Update";
        }
        this.msgTimeSpan = this.miscService.getMessageTimeSpan();
        let year = new Date();
        this.today = year;
        this.yearRange = "2000:" + year.getFullYear();
    }
    ngOnInit() {
        this.toastrService.overlayContainer = this.toastContainer;
        this.form = this.formBuilder.group(
            {
                pipelineName: ['', [Validators.required]],
                firmName: ['', [Validators.required]],
                accountType: ['', [Validators.required]],
                strategy: ['', [Validators.required]],
                status: ['', [Validators.required]],
                closingDate: ['', [Validators.required]],
                description: ['', [Validators.required]],
                primaryContact: ['', [Validators.required]],
                sector:['',[Validators.required]]
            }
        );
        this.sourceURL = this.miscService.GetPriviousPageUrl();
        this.getPipelineDetails();
        this.getMasterData();
    }
    getSideNavWidth()
  {
    this.sideNavWidth = "calc(100% - " + this.miscService.getSideBarWidth() + ")";
  }
  onResized($event)
  {
    this.getSideNavWidth();
  }
    getMasterData() {
        this.firmLoading = true;
        this.accountTypeLoading = true;
        this.strategyLoading = true;
        this.statusLoading = true;
        this.pipelineService.getMasterData().subscribe({next:result => {
            let resp = result;
            if (resp != null) {
                let localModel = this.model;
                this.masterModel.firmList = resp.firmList;
                if (this.model.firmDetail != null && this.model.firmDetail.firmID > 0) {
                    this.model.firmDetail = this.masterModel.firmList.filter(function (element: any, index: any) { return element.firmID == localModel.firmDetail.firmID; })[0];
                }
                this.masterModel.accountTypeList = resp.accountTypeList;
                if (this.model.accountTypeDetails != null && this.model.accountTypeDetails.accountTypeID > 0) {
                    this.model.accountTypeDetails = this.masterModel.accountTypeList.filter(function (element: any, index: any) { return element.accountTypeID == localModel.accountTypeDetails.accountTypeID; })[0];
                }
                this.masterModel.statusList = resp.pipelineStatusList;
                if (this.model.statusDetail != null && this.model.statusDetail.statusID > 0) {
                    this.model.statusDetail = this.masterModel.statusList.filter(function (element: any, index: any) { return element.statusID == localModel.statusDetail.statusID; })[0];
                }
                this.masterModel.strategyList = resp.strategyList;
                if (this.model.strategyDetails != null && this.model.strategyDetails.strategyID > 0) {
                    this.model.strategyDetails = this.masterModel.strategyList.filter(function (element: any, index: any) { return element.strategyID == localModel.strategyDetails.strategyID; })[0];
                }
                this.masterModel.usersList = resp.usersList;
                this.masterModel.sectorList = resp.sectorLists;
            }
            this.firmLoading = false;
            this.accountTypeLoading = false;
            this.strategyLoading = false;
            this.statusLoading = false;

        }, error:error => {
            this.firmLoading = true;
            this.accountTypeLoading = true;
            this.strategyLoading = true;
            this.statusLoading = true;
        }});
    }
    getPipelineDetails() {
        if (this.id != undefined) {
            this.loading = true;
            this.title = "Update";
            this.resetText = "Reset";
            this.pipelineService.getPipelineById({ Value: this.id })
                .subscribe({next:result => {
                    this.model = result;
                    this.model.pipelineName = result?.name;
                    this.model.primaryContact = result?.usersModel;
                    this.model.closingDate = new Date(this.model.closingDate);
                    this.loading = false;
                },error: error => {
                    this.loading = false;

        }});
        }
    }
    addPipeline() {
        this.loading = true;
        this.model.name = this.model.pipelineName;
        this.model.primaryContactId = this.model?.primaryContact?.id;
        if (this.title == "Create") {
            this.pipelineService.createPipeline(this.model)
                .subscribe({next:
                    data => {
                        this.submitted = false;
                        this.formReset(null);
                        this.loading = false;
                        this.toastrService.success("Pipeline added successfully", "", { positionClass: "toast-center-center" });
                    },
                    error:error => {
                        this.toastrService.error("Pipeline Name already exist", "", { positionClass: "toast-center-center" });
                        this.loading = false;
                    }});
        }
        else if (this.title == "Update") {
            this.pipelineService.updatePipeline(this.model)
                .subscribe({next:
                    data => {
                        this.submitted = false;
                        this.loading = false;
                        this.toastrService.success("Pipeline updated successfully", "", { positionClass: "toast-center-center" });
                    },
                    error:error => {
                        this.toastrService.error("Pipeline Name already exist", "", { positionClass: "toast-center-center" });
                        this.loading = false;
                    }});
        }
    }
    formReset(f: any) {
        this.form?.reset();
        this.changeDetectorRef.detectChanges();
        this.model = {};
        this.getPipelineDetails();
    }

}
