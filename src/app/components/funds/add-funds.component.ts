import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Message } from 'primeng/api/message';
import { AccountService } from '../../services/account.service';
import { FirmService } from '../../services/firm.service';
import { FundService } from '../../services/funds.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { NgbDateParserFormatter_uk } from '../../shared/NgbDateParserFormatter_uk';
import { ToastrService } from "ngx-toastr";
import { FormControl, NgForm } from '@angular/forms';
import { FundInvestorConstants, M_Datatypes, NumberDecimalConst } from 'src/app/common/constants';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { FundPageSectionConstants, FundStaticDetailConstants, FundTermFieldConstants } from "../../common/constants";
import { PageConfigurationSubFeature } from "../../common/enums";
import { PageConfigFieldModel } from "../../common/models";

@Component({
	selector: 'createfund',
	templateUrl: "./add-funds.component.html",
	styleUrls: ["./add-funds.component.scss"],
	providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateParserFormatter_uk }]

})
export class AddFundComponent implements OnInit {
	fundColumns = [];
	FundInvestorConstants = FundInvestorConstants;
	mDataTypes = M_Datatypes;
	NumberDecimalConst = NumberDecimalConst;
	investorEditMode: boolean = false;
	fundInvestor: any = {
		fundInvestorId: 0
	};
	investorLoading: boolean = false;
	investorNameList: any = [];
	tabList: any = [];
	tabName: string = "";
	model: any = {
		investorListData: []
	};
	title: string = "Create";
	resetText: string = "Reset";
	id: string;
	masterModel: any = {};
	geographyModel: any;
	msgTimeSpan: number;
	loading: boolean;
	datemodel: NgbDateStruct;
	msgs: Message[] = [];
	masterDataLoadRequired: boolean = true;
	yearOptions: any = [];
	clawbackOptions: any = [{ value: "Yes", text: "Yes" }, { value: "No", text: "No" }]
	regionListClone: any[] = [];
	countryListClone: any[] = [];
	pcInvestors: any = {};
	dynamicHeader: any = [];
	dynamicHeaderClone: any = [];
	investorHeader: string = null;
	isOpenconfirmPopUp: boolean = false;
	editInvestorData: any = null;
	linkText: boolean = false;
	subPageDetailList: any[] = [];
	fundStaticInfoFieldList: any[] = [];
	fundTermFieldList: any[] = [];
	customfieldValueList: any[] = [];
	geographicLocationFieldList: any[];
	fundStrategyDesc: any = {};
	fundPageSectionConstants = FundPageSectionConstants;
	fundStaticDetailConstants = FundStaticDetailConstants;
	fundTermFieldConstants = FundTermFieldConstants;
	sideNavWidth:any ="";
	constructor(private _avRoute: ActivatedRoute, private miscService: MiscellaneousService, private firmService: FirmService, private datePipe: DatePipe,
		private _fundService: FundService, private _router: Router, protected changeDetectorRef: ChangeDetectorRef, private accountService: AccountService
		, private toastrService: ToastrService) {
		if (this._avRoute.snapshot.params["id"]) {
			this.id = this._avRoute.snapshot.params["id"];
			this.loading = true;
			this.title = "Update";
			this.resetText = "Reload";
		}

		this.msgTimeSpan = this.miscService.getMessageTimeSpan();
		this.yearOptions = this.miscService.bindYearList();
	}
	sourceURL: any;
	ngOnInit() {
		this.sourceURL = this.miscService.GetPriviousPageUrl();
		this.setDefaultValues();
		this.getInvestorList();
	}
	getSideNavWidth()
  {
    this.sideNavWidth = "calc(100% - " + this.miscService.getSideBarWidth() + ")";
  }
  onResized(_$event)
  {
    this.getSideNavWidth();
  }
	setupTab() {

		  this.tabList.push({
			isActive: true,
			name: "Investors",
			isSelected: true,
			displayName: "Investors"
		  });

		if (this.isFieldActive(this.subPageDetailList, FundPageSectionConstants.GeoLocation)) {		 
		  this.tabList.push({
			isActive: this.isFieldActive(this.subPageDetailList, FundPageSectionConstants.GeoLocation),
			name: FundPageSectionConstants.GeoLocation,
			isSelected: false,
			displayName: this.getStaticFieldDisplayName(this.subPageDetailList, FundPageSectionConstants.GeoLocation)
		  });
		}

		this.tabName = this.tabList[0].name;

	  }

	numbersOnlyValidator(event: any) {
		const pattern = /^[0-9\-]*$/;
		if (!pattern.test(event.target.value)) {
			event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
		}
	}
	decimalnumbersOnlyValidator(event: any) {
		const pattern = /^[0-9,.\-]*$/;
		if (!pattern.test(event.target.value)) {
			event.target.value = event.target.value.replace(/[^0-9,.\-]/g, "");
		}
	}
	isNumberKey(evt, obj) {
		let charCode = (evt.which) ? evt.which : evt.keyCode
		let value = obj.value;
		let dotcontains = value.indexOf(".") != -1;
		if (dotcontains)
			if (charCode == 46) return false;
		if (charCode == 46) return true;
		if (charCode > 31 && (charCode < 48 || charCode > 57))
			return false;
		return true;
	}

	setDefaultValues() {
		if (this.id != undefined) {
			this.loading = true;
			this.title = "Update";
			this._fundService.getFundById({ EncryptedFundId: this.id, PaginationFilter: null })
				.subscribe({next:result => {
					let resp = result["body"];
					if (resp != null && result.code == "OK") {
						this.model = resp.fundDetails.fundList[0];
						this.model.investorListData = [];
						this.model.fundClosingDate = this.model.fundClosingDate != null ? new Date(this.model.fundClosingDate) : null;
						this.customfieldValueList = this.formatPageFieldResponse(resp.fundStaticConfiguartionData).concat(this.formatPageFieldResponse(resp.fundTermsConfiguartionData));

						if (this.masterDataLoadRequired) {
							this.getMasterFundModel();
						}
						this.getFundInvestorList();
					}
					else {
						if (resp.status != null && resp.status.message != "")
							this.toastrService.error(resp.status.message, "", { positionClass: "toast-center-center" });
					}
					this.loading = false;
				}, error:_error => {
					this.loading = false;
				}});
		}
		else {
			this.model = {};
			this.model.investorListData = [];
			setTimeout(function (local: any) {
				local.model.geographyDetail = {};
			}, 10, this);

			if (this.masterDataLoadRequired) {
				this.getMasterFundModel();
			}
			this.model.fundID = 0;
			this.getFundInvestorList();
		}
	}

	selectTab(tab) {
		this.tabList.forEach(t => t.isSelected = false);
		tab.isSelected = true;
		this.tabName = tab.name;
	}

	formatPageFieldResponse = (result: any[]): PageConfigFieldModel[] => {

		let formatResult: PageConfigFieldModel[] = result.map(x => <PageConfigFieldModel>({
			fieldID: x.fieldID || x.id,
			subPageID: x.subPageID,
			name: x.name,
			displayName: x.displayName,
			value: !x.value ? 'NA' : x.value,
			isMandatory: x.isMandatory || false,
			isActive: x.isActive || false,
			dataTypeId: x.dataTypeId||0
		}));
		return formatResult || [];

	}

	getStaticFieldDisplayName(items: any, sectionName: string) {
		let result = items.find(x => x.name == sectionName);
		return (result && result.displayName) || "";
	}

	isFieldActive(items: any[], sectionName: string): boolean {
		let result = items.find(x => x.name == sectionName);
		return ((result && result.isActive) || false);
	}
	sortByKey(array, key) {
		return array.sort(function(a, b) {
			let x = a[key]; let y = b[key];
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	}

	AddOrUpdateCustomFieldValue(event, customField) {
		let val = event.target.value;
		let index = this.customfieldValueList.findIndex(x => x.displayName == customField.displayName
			&& x.fieldID == customField.fieldID);
		if (index != null) {
			let data = this.customfieldValueList;
			data[index].value = (val || '').trim();
			this.customfieldValueList = data
			this.model.customFieldValueList = data;
		}

	}


	getMasterFundModel() {
		this.firmLoading = true;
		this.accountTypeLoading = true;
		this.strategyLoading = true;
		this.sectorLoading = true;
		this.currencyLoading = true;
		this.countryLoading = true;
		this.regionLoading = true;
		this._fundService.getMasterFundModel().subscribe({next:result => {

			let resp = result["body"];
			if (resp != null) {
				let localModel = this.model;

				this.masterModel.firmList = resp.firmList;
				if (this.model.firmDetail != null && this.model.firmDetail.firmID > 0) {
					this.model.firmDetail = this.masterModel.firmList.filter(function (element: any, _index: any) { return element.firmID == localModel.firmDetail.firmID; })[0];
				}

				this.masterModel.accountTypeList = resp.accountTypeList;
				if (this.model.accountTypeDetail != null && this.model.accountTypeDetail.accountTypeID > 0) {
					this.model.accountTypeDetail = this.masterModel.accountTypeList.filter(function (element: any, _index: any) { return element.accountTypeID == localModel.accountTypeDetail.accountTypeID; })[0];
				}

				this.masterModel.strategyList = resp.strategyList;
				if (this.model.strategyDetail != null && this.model.strategyDetail.strategyID > 0) {
					this.model.strategyDetail = this.masterModel.strategyList.filter(function (element: any, _index: any) { return element.strategyID == localModel.strategyDetail.strategyID; })[0];
				}

				this.masterModel.sectorList = resp.sectorList;
				if (this.model.sectorDetail != null && this.model.sectorDetail.sectorID > 0) {
					this.model.sectorDetail = this.masterModel.sectorList.filter(function (element: any, _index: any) { return element.sectorID == localModel.sectorDetail.sectorID; })[0];
				}

				this.masterModel.currencyList = resp.currencyList;
				if (this.model.currencyDetail != null && this.model.currencyDetail.currencyID > 0) {
					this.model.currencyDetail = this.masterModel.currencyList.filter(function (element: any, _index: any) { return element.currencyID == localModel.currencyDetail.currencyID; })[0];
				}

				this.masterModel.countryList = resp.countryList;
				this.countryListClone = JSON.parse(JSON.stringify(resp.countryList));
				if (this.model.geographyDetail != null && this.model.geographyDetail.country != null && this.model.geographyDetail.country.countryId > 0) {
					this.model.geographyDetail.country = this.masterModel.countryList.filter(function (element: any, _index: any) { return element.countryId == localModel.geographyDetail.country.countryId; })[0];

				}

				this.masterModel.regionList = resp.regionList;
				this.regionListClone = JSON.parse(JSON.stringify(resp.regionList));
				if (this.model.geographyDetail != null && this.model.geographyDetail.region != null && this.model.geographyDetail.region.regionId > 0) {
					this.model.geographyDetail.region = this.masterModel.regionList.filter(function (element: any, _index: any) { return element.regionId == localModel.geographyDetail.region.regionId; })[0];
				}

				this.subPageDetailList = resp.subPageDetailList;
				this.masterModel.pageFieldList = resp.pageFieldList;

				this.fundStaticInfoFieldList = this.formatPageFieldResponse(this.masterModel.pageFieldList.filter(x => x.subPageID == PageConfigurationSubFeature.FundStaticInformation));
				this.fundTermFieldList = this.formatPageFieldResponse(this.masterModel.pageFieldList.filter(x => x.subPageID == PageConfigurationSubFeature.FundTerms));
				this.geographicLocationFieldList = this.formatPageFieldResponse(this.masterModel.pageFieldList.filter(x=> x.subPageID == PageConfigurationSubFeature.FundGeographicLocations));
				let tempArr: any[] = this.formatPageFieldResponse(this.masterModel.pageFieldList.filter(x => x.isCustom && x.isActive));
				if (this.customfieldValueList.length == 0) {
					this.customfieldValueList = tempArr;
				} else {

					tempArr.forEach( (i , idx) => {
						let customField = this.customfieldValueList.find(x => x.fieldID == i.fieldID);
						if (customField != null) {
							i = { ...i, ...customField };
						}
						tempArr[idx] = i;
						
					});
					this.customfieldValueList = tempArr;
				}



				let description = this.masterModel.pageFieldList.find(x => x.name == FundStaticDetailConstants.StrategyDescription);
				if (description!=undefined && description!=null) {
					this.fundStrategyDesc = {
						name: description.name,
						displayName: description.displayName,
						value: description.value,
						isMandatory: description.isMandatory || false,
						isActive: description.isActive || false
					};
				}
				this.setupTab();

			}

			this.firmLoading = false;
			this.accountTypeLoading = false;
			this.strategyLoading = false;
			this.sectorLoading = false;
			this.currencyLoading = false;
			this.countryLoading = false;
			this.regionLoading = false;
		}, error:_error => {
			this.firmLoading = true;
			this.accountTypeLoading = true;
			this.strategyLoading = true;
			this.sectorLoading = true;
			this.currencyLoading = true;
			this.countryLoading = true;
			this.regionLoading = true;
		}});
	}

	firmLoading: boolean;
	clearInvestor(form: NgForm) {
		this.investorEditMode = false;
		this.fundInvestor = {
			fundInvestorId: 0
		};
		if (form) {
			for (let item in form?.form?.controls) {
				(<FormControl>form?.form?.controls[item]).markAsPristine();
			}
		}
		form.reset();
	}
	addInvestor(form: NgForm) {
		if (!form.valid) {
			for (let eachControl in form.form.controls) {
				(<FormControl>form.form.controls[eachControl]).markAsDirty();
			}
			return;
		}
		let header = JSON.parse(JSON.stringify(this.dynamicHeader));
		let dynamicData = header?.filter(x => x.name === 'Customfield');
		if (this.fundInvestor?.investor != undefined) {
			this.fundInvestor.investorId = this.fundInvestor?.investor.investorId;
			this.fundInvestor.investorName = this.fundInvestor?.investor.investorName;
		}
		if (dynamicData != undefined && dynamicData.length > 0) {
			this.fundInvestor.fundInvestorConfigData = dynamicData;
			let fundInvestorData = this.fundInvestor;
			dynamicData.forEach(function (item) {
				fundInvestorData[item.displayName] = item.value;
			});
			this.fundInvestor = fundInvestorData;
		}
		if (this.investorEditMode) {
			this.updateInvestor(form);
		}
		else if (this.fundInvestor?.fundInvestorId != undefined) {
			let fundInvestorId = this.fundInvestor.investor.investorId;
			let existingInvestor = this.model?.investorListData?.filter(function (ele: any) {
				return ele.investorId == fundInvestorId;
			});
			if (this.model?.investorListData?.length == 0 || existingInvestor.length == 0) {
				this.fundInvestor.fundInvestorId = 1;
				if (this.model.investorListData.length > 0) {
					let maxVal = this.model.investorListData.reduce(function (
						prev: any,
						current: any
					) {
						return prev.fundInvestorId > current.fundInvestorId ? prev : current;
					});
					this.fundInvestor.fundInvestorId = maxVal.fundInvestorId + 1;
				}
				this.fundInvestor.isActive = true;
				this.fundInvestor.CommitmentDate = this.fundInvestor.CommitmentDate != null && this.fundInvestor.CommitmentDate != undefined ? new Date(this.fundInvestor.CommitmentDate.setTime(this.fundInvestor.CommitmentDate.getTime() + (12 * 60 * 60 * 1000))) : this.fundInvestor.CommitmentDate;
				this.fundInvestor.CommitmentDate = (this.fundInvestor.CommitmentDate != null && this.fundInvestor.CommitmentDate != undefined && this.fundInvestor.CommitmentDate != "NA") ? JSON.parse(JSON.stringify(this.fundInvestor.CommitmentDate)) : this.fundInvestor.CommitmentDate;
				this.model.investorListData.push(this.fundInvestor);
				this.clearInvestor(form);
			} else {
				this.toastrService.error("Investor with the same is already added in the list", "", { positionClass: "toast-center-center" });
			}
		} else {
			this.toastrService.error("Please select the required fields", "", { positionClass: "toast-center-center" });
		}
	}
	updateInvestor(form: NgForm) {
		if (this.fundInvestor?.fundInvestorId != null) {
			delete this.fundInvestor['InvestorId'];
			let fundInvestorId = this.fundInvestor.investor.investorId;
			if (this.fundInvestor.CommitmentDate != undefined) {
				this.fundInvestor.CommitmentDate = this.fundInvestor.CommitmentDate != null && this.fundInvestor.CommitmentDate != undefined ? new Date(this.fundInvestor.CommitmentDate.setTime(this.fundInvestor.CommitmentDate.getTime() + (12 * 60 * 60 * 1000))) : this.fundInvestor.CommitmentDate;
				this.fundInvestor.CommitmentDate = JSON.parse(JSON.stringify(this.fundInvestor.CommitmentDate));
			}
			let existingInvestor = this.model?.investorListData?.filter(function (ele: any) {
				if (ele.investor != undefined)
					return ele.investor.investorId == fundInvestorId;
				else
					return ele.investorId == fundInvestorId;
			});
			if (existingInvestor.length != 0) {
				this.changeDetectorRef.detectChanges();
				this.model.investorListData[
					this.model.investorListData?.indexOf(existingInvestor[0])
				] = this.fundInvestor;
				this.clearInvestor(form);
			} else {
				this.toastrService.error("Investor with the same  is already added in the list", "", { positionClass: "toast-center-center" });
			}
		} else {
			this.toastrService.error("Please select the required fields", "", { positionClass: "toast-center-center" });
		}
	}
	OnCancel(_$event) {
		this.editInvestor = null;
		this.isOpenconfirmPopUp = false;
	}
	OnConfirmLinkAndUnlink(_$event) {
		this.isOpenconfirmPopUp = false;
		let index = this.model?.investorListData.findIndex(x => x.investorId == this.editInvestorData?.investorId);
		if (index > -1)
			this.model.investorListData[index].isActive = this.editInvestorData.isActive ? false : true;
		this.editInvestorData = null;
	}
	editInvestor(investor: any) {
		this.investorEditMode = true;
		this.fundInvestor = JSON.parse(JSON.stringify(investor));
		let dynamicData = this.dynamicHeader;
		let customFieldData = this.dynamicHeader?.filter(x => x.name === 'Customfield');
		let pipe = this.datePipe;
		if (customFieldData != undefined && customFieldData.length > 0) {
			dynamicData.forEach(function (item) {
				if (item.isCustom) {
					let value = investor[item.displayName];
					if (value != undefined && value != null && value != "NA")
						item.value = item.dataType == M_Datatypes.Date ? new Date(pipe.transform(value, 'MM/dd/yyyy')) : value;

				}
			});
			this.dynamicHeader = dynamicData;
		}
		let local = this;
		this.fundInvestor.CommitmentDate = (investor.CommitmentDate != null && investor.CommitmentDate != undefined && investor.CommitmentDate != "NA") ? new Date(this.datePipe.transform(investor.CommitmentDate, 'MM/dd/yyyy')) : investor.CommitmentDate;
		this.fundInvestor.investor = this.investorNameList.filter(
			function (element: any, _index: any) {
				return (
					element.investorId == local.fundInvestor.investorId
				);
			}
		)[0];
	}
	handleKeyDown(e) {
		const typedValue = e.keyCode;
		if (typedValue < 48 && typedValue > 57) {
			return;
		}
		const typedNumber = e.key;
		const min = parseInt(e.target.min);
		const max = parseInt(e.target.max);
		const currentVal = e.target.value;
		const newVal = parseFloat(currentVal.toString() + typedNumber.toString());
		if (newVal < min || newVal > max) {
			e.preventDefault();
			e.stopPropagation();
		}
	}
	getInvestorList() {
		this.investorLoading = true;
		this.investorNameList = [];
		this._fundService.getInvestors().subscribe({next:result => {
			if (result != null && result?.length > 0)
				this.investorNameList = result;
			this.investorLoading = false;
		},error: _error => {
			this.investorLoading = false;
		}});
	}
	numberOnly(event): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode == 46) {
			return true;
		} else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;

	}
	getFundInvestorList() {
		this._fundService.getFundInvestors(this.model.fundID).subscribe({next:result => {
			if (result != null)
				this.model.investorListData = result?.customFieldData;
			let filteredData = result?.dynamicColumns?.filter(x => x.name != 'FundId' && x.name != 'FirmName');
			if (filteredData.length > 0) {
				this.dynamicHeader = filteredData;
				this.fundColumns = filteredData;
				this.dynamicHeaderClone = JSON.parse(JSON.stringify(filteredData));
				this.investorHeader = result?.headerText;
			}
			else {
				this.tabList.splice(0, 1);
				this.tabList[0].active = true;
				this.tabName = this.tabList[0].name;
			}
		}, error:_error => {
		}});
	}
	setLinkDelinkInvestor(investor: any) {
		this.editInvestorData = investor;
		this.isOpenconfirmPopUp = true;
	}
	accountTypeLoading: boolean;
	strategyLoading: boolean;
	sectorLoading: boolean;
	currencyLoading: boolean;
	countryLoading: boolean;
	regionLoading: boolean;
	save(f: any) {
		this.loading = true;
		if (this.title == "Create") {
			this.model.targetCommitment = isNaN(parseFloat(this.model.targetCommitment))?null:parseFloat(this.model.targetCommitment);
			this.model.maximumCommitment = isNaN(parseFloat(this.model.maximumCommitment))?null:parseFloat(this.model.maximumCommitment);
			this.model.fundSize = isNaN(parseFloat(this.model.fundSize))?null:parseFloat(this.model.fundSize);
			this.model.gpCommitment = isNaN(parseFloat(this.model.gpCommitment))?null:parseFloat(this.model.gpCommitment);
			this.model.preferredReturnPercent = isNaN(parseFloat(this.model.preferredReturnPercent))?null:parseFloat(this.model.preferredReturnPercent);
			this.model.carriedInterestPercent = isNaN(parseFloat(this.model.carriedInterestPercent))?null:parseFloat(this.model.carriedInterestPercent);
			this.model.gpCatchupPercent = isNaN(parseFloat(this.model.gpCatchupPercent))?null:parseFloat(this.model.gpCatchupPercent);
			this.model.managementFee =isNaN( parseFloat(this.model.managementFee))?null: parseFloat(this.model.managementFee);
			this.model.managementFeeOffset = isNaN(parseFloat(this.model.managementFeeOffset))?null:parseFloat(this.model.managementFeeOffset);
			this.model.orgExpenses = isNaN(parseFloat(this.model.orgExpenses))?null:parseFloat(this.model.orgExpenses);
			this.model.fundClosingDate = this.model.fundClosingDate != null ? moment(this.model.fundClosingDate).utc().format() : this.model.fundClosingDate;
			this._fundService.createFund(this.model)
				.subscribe({next:(data) => {
					if (data.code == "OK") {
						this.toastrService.success(data.message, "", { positionClass: "toast-center-center" });
						this.formReset(f);
						//setTimeout(()=>{
							this.cancel();
						//},3000);
					}
					else {
						this.toastrService.error(data.message, "", { positionClass: "toast-center-center" });
					}
					this.loading = false;
				}, error:error => {
					this.toastrService.error(error, "", { positionClass: "toast-center-center" });
					this.loading = false;
				}});
		}
		else if (this.title == "Update") {
			this.model.fundSize = this.model.fundSize != "" ? this.model.fundSize : null;
			this.model.clawback = this.model.clawback != undefined ? this.model.clawback : null;
			this.model.targetCommitment = parseFloat(this.model.targetCommitment);
			this.model.maximumCommitment = parseFloat(this.model.maximumCommitment);
			this.model.fundSize = parseFloat(this.model.fundSize);
			this.model.gpCommitment = parseFloat(this.model.gpCommitment);
			this.model.preferredReturnPercent = parseFloat(this.model.preferredReturnPercent);
			this.model.carriedInterestPercent = parseFloat(this.model.carriedInterestPercent);
			this.model.gpCatchupPercent = parseFloat(this.model.gpCatchupPercent);
			this.model.managementFee = parseFloat(this.model.managementFee);
			this.model.managementFeeOffset = parseFloat(this.model.managementFeeOffset);
			this.model.orgExpenses = parseFloat(this.model.orgExpenses);
			this.model.fundClosingDate = this.model.fundClosingDate != null ? moment(this.model.fundClosingDate).utc().format() : this.model.fundClosingDate;	
			this._fundService.updateFund(this.model)
				.subscribe({next:(data) => {
					if (data.code == "OK") {
						this.toastrService.success(data.message, "", { positionClass: "toast-center-center" });
						this.formReset(f);
					}
					else {
						this.toastrService.error(data.message, "", { positionClass: "toast-center-center" });
					}
					this.changeDetectorRef.detectChanges();
					this.model.fundClosingDate = new Date(this.model.fundClosingDate);
					this.loading = false;
				}, error:_error => {
					this.toastrService.error("Fund not updated", "", { positionClass: "toast-center-center" },);
					this.loading = false;
				}});
		}

	}
	onSelectFundClosingDate =(date: any) => {
		if (date !== null) {		
			this.model.fundClosingDate = moment(date).format();		
		}

	}
	onChangeCommitmentDate(date) {
		if (date !== null) {
			this.fundInvestor.CommitmentDate = moment(date).format('MM/DD/YYYY');
		}

	}
	cancel() {
		this._router.navigate(['/fund-list']);
	}

	formReset(f: any) {
		f.resetForm();

		this.masterModel.regionList = JSON.parse(JSON.stringify(this.regionListClone));
		this.masterModel.countryList = JSON.parse(JSON.stringify(this.countryListClone));

		this.changeDetectorRef.detectChanges();
		this.masterDataLoadRequired = false;
		this.setDefaultValues();
	}
}
