﻿import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Message } from "primeng/api/message";
import { MessageService } from "primeng/api";
import { AccountService } from '../../services/account.service';
import { DealService } from '../../services/deal.service';
import { FundService } from '../../services/funds.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { PortfolioCompanyService } from '../../services/portfolioCompany.service';
import { NgbDateParserFormatter_uk } from '../../shared/NgbDateParserFormatter_uk';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import {DealDetailsConstants} from "../../common/constants";
import * as moment from 'moment';

@Component({
	selector: 'createfund',
	templateUrl: './save-deals.component.html',
	styleUrls:["./save-deals.component.scss"],
    encapsulation: ViewEncapsulation.None,
	providers: [
		{ provide: NgbDateParserFormatter, useClass: NgbDateParserFormatter_uk }, MessageService
	]
})

export class SaveDealComponent implements OnInit {
	model: any = {};
	title: string = "Create";
	resetText: string = "Reset";
	id: string;
	msgs: Message[] = [];
	masterModel: any = {};
	geographyModel: any;
	msgTimeSpan: number;
	masterDataLoadRequired: boolean = true;
	loading: boolean = false;
	datemodel: NgbDateStruct;
	yearRange: string = "";
	today: Date;
	@ViewChild(ToastContainerDirective, {})
	toastContainer: ToastContainerDirective;
	dealData = [];
	customFieldsData=[];
	isUpdate=false;
	pageDetails ={displayName:''};
	dealDetailsConstants = DealDetailsConstants;
	sideNavWidth:any ="";
	fundList: any=[];
	selectedFundDetails: any = {};
	selectedPortfolioCompanyDetails: any = {};
	portfolioCompanyList: any=[];
	constructor(private toastrService: ToastrService,private _avRoute: ActivatedRoute, 
		private miscService: MiscellaneousService, private fundService: FundService, 
		private portfolioService: PortfolioCompanyService,
		private _dealService: DealService, private _router: Router, protected changeDetectorRef: ChangeDetectorRef, 
		private accountService: AccountService) {
		if (this._avRoute.snapshot.params["id"]) {
			this.id = this._avRoute.snapshot.params["id"];
			this.title = "Update";
			this.resetText = "Reload";
		}
		this.msgTimeSpan = this.miscService.getMessageTimeSpan();
		let year = new Date();
		this.today = year;
		this.yearRange = "2000:" + year.getFullYear();
	}

    sourceURL: any;
    ngOnInit() {
		this.toastrService.overlayContainer = this.toastContainer;
        this.sourceURL = this.miscService.GetPriviousPageUrl();
		this.setDefaultValues();
	}
	getSideNavWidth()
	{
	  this.sideNavWidth = "calc(100% - " + this.miscService.getSideBarWidth() + ")";
	}
	onResized(_$event)
	{
	  this.getSideNavWidth();
	}
	setDefaultValues() {
		if (this.id != undefined) {
			this.loading = true;
			this.title = "Update";
			//get user details by user id
			this.isUpdate = true;
			this.getDealConfigurationAndData(this.id);
		}
		else {
			this.isUpdate = false;
			this.getDealConfigurationAndData(null);
			if (this.masterDataLoadRequired) {
				this.getMasterList();
			}
		}
	}

	getDealConfigurationAndData(id){
		this._dealService.getDealsPageConfiguration({ encryptedDealID: id, includeAllDetails: true, includeAllPageConfiguration : true,IsLoadDeal:id==null?true:false })
		.subscribe({next:(result) => {
			let resp =result!=null? result["body"] :null;
			if (resp != null && result.code == "OK") {
				if(id !== null){
					this.model = resp.dealDetails.dealList[0];
					if(this.model.investmentDate !== null)
						this.model.investmentDate = new Date(this.model.investmentDate);
				}
				this.dealData = resp.staticFieldValueList;
				this.model.dealConfigurationData = resp.staticFieldValueList;
				this.customFieldsData = resp.staticFieldValueList.filter(x => x.name === 'Customfield');
				this.pageDetails = resp.pageDetails !== undefined ? resp.pageDetails : this.pageDetails;
				if (this.masterDataLoadRequired) {
					this.getMasterList();
				}

			}
			else {
				if (result?.message != "") {
					this.toastrService.error("error", "", { positionClass: "toast-center-center" });
				}
			}
			//when No record found or something went wrong
			this.loading = false;
		}, error:_error => {
			this.loading = false;
		}});
	}
	onSelectDealInvestmentDate =(date: any) => {
		if (date !== null)		
			this.model.investmentDate = moment(date).format('MM/DD/YYYY');	
	}
	AddOrUpdate(event,dealDetails){
		let val = event.target.value;
		if(val != undefined){
			let data = this.customFieldsData;
			let index = this.customFieldsData.indexOf(dealDetails);
			data[index].value = val;
			this.customFieldsData = data
			this.model.dealConfigurationData = data;
		}
	}
	getMasterList() {

		this.currencyLoading = true;
		this.dealBoardSeatLoading = true;
		this.dealExitMethodLoading = true;
		this.dealInvestmentStageLoading = true;
		this.dealSecurityTypeLoading = true;
		this.dealSourcingLoading = true;
		this.dealTransactionRoleLoading = true;
		this.dealValuationMethodologyLoading = true;
		this.fundsLoading = true;
		this.portfolioCompanyLoading = true;
		this.professionalListLoading = true;
		this._dealService.getMasterDealModel().subscribe({next:(result)=>{
			let resp = result["body"];
			if (resp != null) {
				this.masterModel.currencyList = resp.currencyList;
				let localModel = this.model;
				if (this.model != null && this.model.reportingCurrencyID > 0) {
					this.model.currencyDetail = this.masterModel.currencyList.filter(function (element: any, _index: any) { return element.currencyID == localModel.reportingCurrencyID; })[0];
				}

				this.masterModel.dealBoardSeatList = resp.dealBoardSeatList;
				if (this.model != null && this.model.dealBoardSeatID > 0) {
					this.model.dealBoardSeatDetail = this.masterModel.dealBoardSeatList.filter(function (element: any, _index: any) { return element.dealBoardSeatID == localModel.dealBoardSeatID; })[0];
				}

				this.masterModel.dealExitMethodList = resp.dealExitMethodList;
				if (this.model != null && this.model.dealExitMethodID > 0) {
					this.model.dealExitMethodDetail = this.masterModel.dealExitMethodList.filter(function (element: any, _index: any) { return element.dealExitMethodID == localModel.dealExitMethodID; })[0];
				}

				this.masterModel.dealInvestmentStageList = resp.dealInvestmentStageList;
				if (this.model != null && this.model.dealInvestmentStageID > 0) {
					this.model.dealInvestmentStageDetail = this.masterModel.dealInvestmentStageList.filter(function (element: any, _index: any) { return element.dealInvestmentStageID == localModel.dealInvestmentStageID; })[0];
				}

				this.masterModel.dealSecurityTypeList = resp.dealSecurityTypeList;
				if (this.model != null && this.model.dealSecurityTypeID > 0) {
					this.model.dealSecurityTypeDetail = this.masterModel.dealSecurityTypeList.filter(function (element: any, _index: any) { return element.dealSecurityTypeID == localModel.dealSecurityTypeID; })[0];
				}

				this.masterModel.dealSourcingList = resp.dealSourcingList;
				if (this.model != null && this.model.dealSourcingID > 0) {
					this.model.dealSourcingDetail = this.masterModel.dealSourcingList.filter(function (element: any, _index: any) { return element.dealSourcingID == localModel.dealSourcingID; })[0];
				}

				this.masterModel.dealTransactionRoleList = resp.dealTransactionRoleList;
				if (this.model != null && this.model.dealTransactionRoleID > 0) {
					this.model.dealTransactionRoleDetail = this.masterModel.dealTransactionRoleList.filter(function (element: any, _index: any) { return element.dealTransactionRoleID == localModel.dealTransactionRoleID; })[0];
				}

				this.masterModel.dealValuationMethodologyList = resp.dealValuationMethodologyList;
				if (this.model != null && this.model.dealValuationMethodologyID > 0) {
					this.model.dealValuationMethodologyDetail = this.masterModel.dealValuationMethodologyList.filter(function (element: any, _index: any) { return element.dealValuationMethodologyID == localModel.dealValuationMethodologyID; })[0];
				}
			
				this.masterModel.fundList = resp.fundList;
				if (this.model != null && this.model.fundID > 0) {
					this.selectedFundDetails = this.masterModel.fundList.filter(function (element: any, _index: any) { return element.fundID == localModel.fundDetails.fundID; })[0]; 
					this.model.fundDetails = this.masterModel.fundList.filter(function (element: any, _index: any) { return element.fundID == localModel.fundDetails.fundID; })[0];
				}
				this.fundList = resp.fundList;
				this.portfolioCompanyList = resp.portfolioCompanyList;
				this.masterModel.portfolioCompanyList = resp.portfolioCompanyList;
				if (this.model != null && this.model.portfolioCompanyID > 0) {
					this.selectedPortfolioCompanyDetails = this.masterModel.portfolioCompanyList.filter(function (element: any, _index: any) { return element.portfolioCompanyID == localModel.portfolioCompanyDetails.portfolioCompanyID; })[0]; 
					this.model.portfolioCompanyDetails = this.masterModel.portfolioCompanyList.filter(function (element: any, _index: any) { return element.portfolioCompanyID == localModel.portfolioCompanyDetails.portfolioCompanyID; })[0];
				}

				this.masterModel.sourcingProfessionalList = resp.sourcingProfessionalList;
				if (this.model != null && this.model.employeeId > 0) {
					this.model.sourcingProfessionalDetail = this.masterModel.sourcingProfessionalList.filter(function (element: any, _index: any) { return element.employeeId == localModel.sourcingProfessionalDetail.employeeId; })[0];
				}

				this.masterModel.leadProfessionalList = resp.leadProfessionalList;
				if (this.model != null && this.model.employeeId > 0) {
					this.model.leadProfessionalDetail = this.masterModel.leadProfessionalList.filter(function (element: any, _index: any) { return element.employeeId == localModel.leadProfessionalDetail.employeeId; })[0];
                }

			}
			this.currencyLoading = false;
			this.dealBoardSeatLoading = false;
			this.dealExitMethodLoading = false;
			this.dealInvestmentStageLoading = false;
			this.dealSecurityTypeLoading = false;
			this.dealSourcingLoading = false;
			this.dealTransactionRoleLoading = false;
			this.dealValuationMethodologyLoading = false;
			this.fundsLoading = false;
			this.portfolioCompanyLoading = false;
			this.professionalListLoading = false;
		},error: _error => {
			this.currencyLoading = true;
			this.dealBoardSeatLoading = true;
			this.dealExitMethodLoading = true;
			this.dealInvestmentStageLoading = true;
			this.dealSecurityTypeLoading = true;
			this.dealSourcingLoading = true;
			this.dealTransactionRoleLoading = true;
			this.dealValuationMethodologyLoading = true;
			this.fundsLoading = true;
			this.portfolioCompanyLoading = true;
			this.professionalListLoading = true;
	}});
	}

	currencyLoading: boolean;
	getCurrencyList() {

		this.currencyLoading = true;
		this.miscService.getCurrencyList().subscribe({next:result => {
			let resp = result["body"];
			if (resp != null) {
				this.masterModel.currencyList = resp.currencyList;
				let localModel = this.model;
				if (this.model.currencyDetail != null && this.model.currencyDetail.currencyID > 0) {
					this.model.currencyDetail = this.masterModel.currencyList.filter(function (element: any, _index: any) { return element.currencyID == localModel.currencyDetail.currencyID; })[0];
				}
			}
			this.currencyLoading = false;
		}, error:_error => {
			this.currencyLoading = false;
	}});
	}

	dealBoardSeatLoading: boolean;
	getDealBoardSeatList() {
		this.dealBoardSeatLoading = true;
		this.miscService.getDealBoardSeatList().subscribe({next:result => {
			let resp = result["body"] ;
			if (resp != null && result.code == "OK") {
				this.masterModel.dealBoardSeatList = resp.dealBoardSeatList;
				let localModel = this.model;
				if (this.model.dealBoardSeatList != null && this.model.dealBoardSeatList.dealBoardSeatID > 0) {
					this.model.dealBoardSeatDetail = this.masterModel.dealBoardSeatList.filter(function (element: any, _index: any) { return element.dealBoardSeatID == localModel.dealBoardSeatDetail.dealBoardSeatID; })[0];
				}
			}
			this.dealBoardSeatLoading = false;
		},error: _error => {
			this.dealBoardSeatLoading = false;
	}})
	}

	dealExitMethodLoading: boolean;
	getDealExitMethodList() {
		this.dealExitMethodLoading = true;
		this.miscService.getDealExitMethodList().subscribe({next:result => {
			let resp = result["body"] ;
			if (resp != null && result.code == "OK") {
				this.masterModel.dealExitMethodList = resp.dealExitMethodList;
				let localModel = this.model;
				if (this.model.dealExitMethodDetail != null && this.model.dealExitMethodDetail.dealExitMethodID > 0) {
					this.model.dealExitMethodDetail = this.masterModel.dealExitMethodList.filter(function (element: any, _index: any) { return element.dealExitMethodID == localModel.dealExitMethodDetail.dealExitMethodID; })[0];
				}
			}
			this.dealExitMethodLoading = false;
		},error: _error => {
			this.dealExitMethodLoading = false;
	}})
	}

	dealInvestmentStageLoading: boolean;
	getDealInvestmentStageList() {
		this.dealInvestmentStageLoading = true;
		this.miscService.getDealInvestmentStageList().subscribe({next:result => {
			let resp = result["body"];
			if (resp != null && result.code == "OK") {
				this.masterModel.dealInvestmentStageList = resp.dealInvestmentStageList;
				let localModel = this.model;
				if (this.model.dealInvestmentStageDetail != null && this.model.dealInvestmentStageDetail.dealInvestmentStageID > 0) {
					this.model.dealInvestmentStageDetail = this.masterModel.dealInvestmentStageList.filter(function (element: any, _index: any) { return element.dealInvestmentStageID == localModel.dealInvestmentStageDetail.dealInvestmentStageID; })[0];
				}
			}
			this.dealInvestmentStageLoading = false;
		},error: _error => {
			this.dealInvestmentStageLoading = false;
	}})
	}

	dealSecurityTypeLoading: boolean;
	getDealSecurityTypeList() {
		this.dealSecurityTypeLoading = true;
		this.miscService.getDealSecurityTypeList().subscribe({next:result => {
			let resp = result["body"] ;
			if (resp != null && result.code == "OK") {
				this.masterModel.dealSecurityTypeList = resp.dealSecurityTypeList;
				let localModel = this.model;
				if (this.model.dealSecurityTypeDetail != null && this.model.dealSecurityTypeDetail.dealSecurityTypeID > 0) {
					this.model.dealSecurityTypeDetail = this.masterModel.dealSecurityTypeList.filter(function (element: any, _index: any) { return element.dealSecurityTypeID == localModel.dealSecurityTypeDetail.dealSecurityTypeID; })[0];
				}
			}
			this.dealSecurityTypeLoading = false;
		}, error:_error => {
			this.dealSecurityTypeLoading = false;
	}})
	}

	dealSourcingLoading: boolean;
	getDealSourcingList() {
		this.dealSourcingLoading = true;
		this.miscService.getDealSourcingList().subscribe({next:result => {
			let resp = result["body"] ;
			if (resp != null && result.code == "OK") {
				this.masterModel.dealSourcingList = resp.dealSourcingList;
				let localModel = this.model;
				if (this.model.dealSourcingDetail != null && this.model.dealSourcingDetail.dealSourcingID > 0) {
					this.model.dealSourcingDetail = this.masterModel.dealSourcingList.filter(function (element: any, _index: any) { return element.dealSourcingID == localModel.dealSourcingDetail.dealSourcingID; })[0];
				}
			}
			this.dealSourcingLoading = false;
		},error: _error => {
			this.dealSourcingLoading = false;
		}})
	}

	dealTransactionRoleLoading: boolean;
	getDealTransactionRoleList() {
		this.dealTransactionRoleLoading = true;
		this.miscService.getDealTransactionRoleList().subscribe({next:result => {
			let resp = result["body"] ;
			if (resp != null && result.code == "OK") {
				this.masterModel.dealTransactionRoleList = resp.dealTransactionRoleList;
				let localModel = this.model;
				if (this.model.dealTransactionRoleDetail != null && this.model.dealTransactionRoleDetail.dealTransactionRoleID > 0) {
					this.model.dealTransactionRoleDetail = this.masterModel.dealTransactionRoleList.filter(function (element: any, _index: any) { return element.dealTransactionRoleID == localModel.dealTransactionRoleDetail.dealTransactionRoleID; })[0];
				}
			}
			this.dealTransactionRoleLoading = false;
		}, error:_error => {
			this.dealTransactionRoleLoading = false;
		}})
	}

	dealValuationMethodologyLoading: boolean;
	getDealValuationMethodologyList() {
		this.dealValuationMethodologyLoading = true;
		this.miscService.getDealValuationMethodologyList().subscribe({next:result => {
			let resp = result["body"] ;
			if (resp != null && result.code == "OK") {
				this.masterModel.dealValuationMethodologyList = resp.dealValuationMethodologyList;
				let localModel = this.model;
				if (this.model.dealValuationMethodologyDetail != null && this.model.dealValuationMethodologyDetail.dealValuationMethodologyID > 0) {
					this.model.dealValuationMethodologyDetail = this.masterModel.dealValuationMethodologyList.filter(function (element: any, _index: any) { return element.dealValuationMethodologyID == localModel.dealValuationMethodologyDetail.dealValuationMethodologyID; })[0];
				}
			}
			this.dealValuationMethodologyLoading = false;
		}, error:_error => {
			this.dealValuationMethodologyLoading = false;
	}})
	}

	fundsLoading: boolean;
	portfolioCompanyLoading: boolean;
	getPortfolioList() {

		this.portfolioCompanyLoading = true;
		this.portfolioService.getPortfolioCompanyList({}).subscribe({next:result => {
			let resp = result["body"] ;
			if (resp != null && result.code == "OK") {
				this.masterModel.portfolioCompanyList = resp.portfolioCompanyList;
				let localModel = this.model;
				if (this.model.portfolioCompanyDetails != null && this.model.portfolioCompanyDetails.portfolioCompanyID > 0) {
					this.model.portfolioCompanyDetails = this.masterModel.portfolioCompanyList.filter(function (element: any, _index: any) { return element.portfolioCompanyID == localModel.portfolioCompanyDetails.portfolioCompanyID; })[0];
					this.selectedPortfolioCompanyDetails = this.masterModel.portfolioCompanyList.filter(function (element: any, _index: any) { return element.portfolioCompanyID == localModel.portfolioCompanyDetails.portfolioCompanyID; })[0];
				}
			}
			this.portfolioCompanyLoading = false;
		},error: _error => {
			this.portfolioCompanyLoading = false;
		}});
	}

	professionalListLoading: boolean;
	getProfessionalsList() {

		this.professionalListLoading = true;
		this.miscService.getPortfolioCompanyEmployeesList().subscribe({next:result => {
			let resp = result["body"] ;
			if (resp.length == 1) {
				if (resp[0] != null && resp[0] != "") {
					this.professionalListLoading = false;
					return;
				}
			}

			this.masterModel.sourcingProfessionalList = resp;
			this.masterModel.leadProfessionalList = resp;
			let localModel = this.model;

			if (this.model.sourcingProfessionalDetail != null && this.model.sourcingProfessionalDetail.employeeId > 0) {
				this.model.sourcingProfessionalDetail = this.masterModel.sourcingProfessionalList.filter(function (element: any, _index: any) { return element.employeeId == localModel.sourcingProfessionalDetail.employeeId; })[0];
			}
			if (this.model.leadProfessionalDetail != null && this.model.leadProfessionalDetail.employeeId > 0) {
				this.model.leadProfessionalDetail = this.masterModel.leadProfessionalList.filter(function (element: any, _index: any) { return element.employeeId == localModel.leadProfessionalDetail.employeeId; })[0];
			}
			this.professionalListLoading = false;
		}, error:_error => {
			this.professionalListLoading = false;
		}});
	}

    save(f: any) {
	
        this.loading = true;
		this.model.fundDetails = this.selectedFundDetails !=undefined && this.selectedFundDetails != null? this.selectedFundDetails:null;
		this.model.portfolioCompanyDetails = this.selectedPortfolioCompanyDetails !=undefined && this.selectedPortfolioCompanyDetails != null? this.selectedPortfolioCompanyDetails:null;
		this.model.entryMultiple = this.model.entryMultiple != undefined ? parseFloat(this.model.entryMultiple) : null;
		this.model.entryOwnershipPercent = this.model.entryOwnershipPercent != undefined ? parseFloat(this.model.entryOwnershipPercent) : null;
		this.model.currentExitOwnershipPercent = this.model.currentExitOwnershipPercent != undefined ? parseFloat(this.model.currentExitOwnershipPercent) : null;
		this.model.enterpriseValue = this.model.enterpriseValue != undefined ? parseFloat(this.model.enterpriseValue) : null;
		this.model.investmentDate = this.model.investmentDate != null ? moment(this.model.investmentDate).format('YYYY-MM-DDTHH:mm') : this.model.investmentDate;
		this._dealService.saveDeal(this.model)
			.subscribe({next:(data) => {
                if (data.code == "OK") {
					this.toastrService.success(data.message, "", { positionClass: "toast-center-center" });
					this.model.dealConfigurationData = [];
					this.setDefaultValues();
				}
				else {
					this.toastrService.error(data.message, "", { positionClass: "toast-center-center" });
				}
				this.loading = false;

			},error: error => {
				this.toastrService.error(error, "", { positionClass: "toast-center-center" });
				this.loading = false;
			}})
			this.formReset(f);
	}


    private getEmptyDropDownsIfExist() {
        if (this.model.dealBoardSeatDetail?.boardSeat == null) {
            return "Board Seat";
        }
        else if (this.model.dealExitMethodDetail?.exitMethod == null) {
            return "Exit Method";
        }
        else if (this.model.dealInvestmentStageDetail?.investmentStage == null) {
            return "Investment Stage";
        }
        else if (this.model.dealSecurityTypeDetail?.securityType == null) {
            return "Security Type";
        }
        else if (this.model.dealSourcingDetail?.dealSourcing == null) {
            return "Deal Sourcing";
        }
        else if (this.model.dealTransactionRoleDetail?.transactionRole == null) {
            return "Transaction Role";
        }
        else if (this.model.dealValuationMethodologyDetail?.valuationMethodology == null) {
            return "Valuation Methodology";
        }
        else {
            return "";
        }
    }

	formReset(f: any) {
		f.resetForm();
		this.changeDetectorRef.detectChanges();
		this.masterDataLoadRequired = true;
		this.setDefaultValues();

	}
	
}







