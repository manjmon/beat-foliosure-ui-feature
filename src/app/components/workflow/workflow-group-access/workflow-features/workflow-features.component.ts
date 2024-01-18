import { Component, OnInit, Input, OnChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { ConfirmationService, Message, MessageService, TreeNode } from 'primeng/api';
import { PermissionService } from 'src/app/services/permission.service';
import { Table } from 'projects/ng-neptune/src/lib/Table/table.component';
@Component({
  selector: 'app-workflow-features',
  templateUrl: './workflow-features.component.html',
  styleUrls: ['./workflow-features.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class WorkflowFeaturesComponent implements OnInit, OnChanges {
  @Input() scrollHeight: any;
  @Input() groupId: any;
  data: any;
  groupData: any = { groupID: -1 };
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  @ViewChild(Table) tblFeature: Table;
  featureListOriginal: any = [];
  isDisabledBtn: boolean = false;
  mappedFeatureList = [];
  isLoader: boolean = true;
  featuresToBeUpdated = [];
  msgTimeSpan: number;
  id: any;
  groupStatus: boolean = true;
  enableFeature: boolean = true;
  selectedFeatureList: TreeNode[];
  selectedFeaturesClone: any[];
  member: any = {};
  model: any = {
      isActive: this.groupStatus,
      userGroup: [],
      selectedFeatures: []
  };
featureList: TreeNode[];
msgs: Message[] = [];
successMessage: any = true;
loading = false;
cols: any[];
frozenCols: any[];
scrollableCols: any[];
selectedValues: string[] = [];
selectedFeaturesReady: boolean;
isConfirmFullAccess: boolean = false;
message: string = "";
selectedFeature: any = null;
featureFullAccess:boolean = false;
loadingMap:boolean = false;
  constructor(private toastrService: ToastrService,
		private permissionService: PermissionService, protected changeDetectorRef: ChangeDetectorRef) {
  }
  ngOnInit() {
	this.cols = [
		{ field: 'canAdd', header: 'Add' },
		{ field: 'canEdit', header: 'Edit' },
		{ field: 'canView', header: 'View' },
		{ field: 'canExport', header: 'Export' },
		{ field: 'canImport', header: 'Import' },
		{ field: 'canFullAccess', header: 'Full Access' }
	];
	this.scrollableCols = [
	  { field: 'canAdd', header: 'Add' },
	  { field: 'canEdit', header: 'Edit' },
	  { field: 'canView', header: 'View' },
	  { field: 'canExport', header: 'Export' },
	  { field: 'canImport', header: 'Import' },
	  { field: 'canFullAccess', header: 'Full Access' }
  ];

  this.frozenCols = [
	  { field: "checkbox", header: "checkbox" },
	  { field: "features", header: "Features" }
  ];
    this.toastrService.overlayContainer = this.toastContainer;
  }
  ngOnChanges() {
    if (this.groupId !== this.groupData.groupID) {
      this.groupData.groupID = this.groupId;
      this.getFeatureList();
      this.setDefaultValues();
	  this.isDisabledBtn = true;
	  this.isLoader = true;
    }
  }
  checkAnyDataChange(rowData:any,prop:any) {
	this.isDisabledBtn = false;
  }
 
  setDefaultValues() {
		if (this.groupId != undefined && this.groupId!='0') {
			this.loading = true;
			this.permissionService.getGroupById({ Value: this.groupId })
				.subscribe(result => {
					let resp = result["body"];
					if (resp != null && resp.groupID > 0) {
						resp.selectedFeatures=this.createHierarchicalFeatureSelection(resp.selectedFeatures, null);
						this.model = resp;
						this.selectedFeatureList = resp.selectedFeatures;
						this.featureListOriginal = resp.selectedFeatures;
						this.enableDisableFeatures();
					}
					else {
                        this.toastrService.error(resp.response, "", { positionClass: "toast-center-center" });
					}
					this.loading = false;
				}, error => {
					this.loading = false;
				});
		} else {
			this.loading = false;
		}
	}
	isFullAccess() {
		this.permissionService.isFullAccess(this.groupId)
			.subscribe(result => {
				this.featureFullAccess = result;
				let index = this.featureList?.findIndex(x => x?.data?.features?.feature == 'Portfolio Company');
				if (index > -1)
					this.featureList[index].data.isFullAccess = result;
			}, error => {
				this.loading = false;
			});
	  }
	createHierarchicalFeatureSelection(featureList:any,parentFeature:any) {
		let local = this;
        if (featureList != null) {
            featureList.forEach(function (value: any) {
                if (value.children != null && value.children.length > 0) {
                    value.children = local.createHierarchicalFeatureSelection(value.children, value);
                    featureList = featureList.concat(value.children);
                }
                value.parent = parentFeature;
            });
        }
		return featureList;
	}
	createHierarchicalFeature(featureList: any, parentFeature: any) {
		let local = this;
		if (featureList != null) {
			featureList.forEach(function (value: any) {
				if (value.children != null && value.children.length > 0) {
					value.children = local.createHierarchicalFeature(value.children, value);
					featureList = featureList.concat(value.children);
				}
				value.parent=null;
			});
		}
		return featureList;
	}
	saveFeature() {
    this.loading=true;
	this.loadingMap =true;
		let local = this;
		let parents: any[] = [];
		if (local.model.selectedFeatures != null) {
			local.model.selectedFeatures.filter(function (eleSelected: any) {
				if (eleSelected.parent != null) {
					let selection = local.model.selectedFeatures.filter(function (ele1: any) {
						return eleSelected.parent.data.features.featureId == ele1.data.features.featureId;
					})
					if (selection.length <= 0) {
						parents.push(eleSelected.parent);
					}
				}
			});
		}
		let selectedFearureList = this.serializeFeatureList(this.createHierarchicalFeature(this.featureList, null));
		let mainselectedFearureList = selectedFearureList.filter(function (ele: any) {
			if (local.model.selectedFeatures != null) {
				let selectedFeatures = local.model.selectedFeatures.filter(function (eleSelected: any) {
					if (eleSelected.data.features.featureId == ele.data.features.featureId) {
						return true;
					}
					return false;

				});
				return selectedFeatures.length > 0;
			}
      return false;
		});
		let parentselectedFearureList :any[]= []
		selectedFearureList = mainselectedFearureList.concat(parentselectedFearureList);
		this.model.selectedFeatures = [];
		let modelClone = JSON.parse(JSON.stringify(this.model));
		selectedFearureList.forEach(element => {
			if(element.data.isFullAccess === null){
				element.data.isFullAccess = false;
			}
			return element;
		});
		this.model.selectedFeatures = selectedFearureList;
		modelClone.selectedFeatures = this.serializeFeatureList(this.model.selectedFeatures);
			this.permissionService.updateGroup(modelClone)
				.subscribe(
					data => {
						this.loading = false;
						this.loadingMap =false;					
						if (data.code == 'OK') {
							this.toastrService.success('Selected features mapped successfully to the selected sub-group', "", { positionClass: "toast-center-center" });
							this.formReset();
						}
						else
							this.toastrService.error("something went wrong", "", { positionClass: "toast-center-center" });
					},
					error => {
						this.toastrService.error(error.message, "", { positionClass: "toast-center-center" });
						this.loading = false;
						this.loadingMap =false;	
					});
	}

	resetMapping() {
		this.featureList = [];
		this.featureListOriginal = [];
		this.getFeatureList();
		this.setDefaultValues();
		this.isDisabledBtn = true;
	}
	getFeatureList() {
		this.isLoader = true;
		this.permissionService.getFeatureList({ Value: this.groupId == undefined ? '0' : this.groupId }).subscribe(result => {
			this.featureList = result["body"];
			this.featureListOriginal=result["body"];
			this.enableDisableFeatures();
			this.isLoader = false;
			this.isFullAccess();
		}, error => {
			this.isLoader = false;
		});
	}

	enableDisableFeatures() {
		let local = this;
		if (this.model.selectedFeatures != null && this.featureList != null && this.model.selectedFeatures.length > 0 && this.featureList.length > 0) {
			this.featureList=this.enableDisableMainFeatureList(this.featureList);
			this.model.selectedFeatures = this.model.selectedFeatures.filter(function (eleSelected: any) {
				if (local.checkMatchedFeatureInHierarchy(local.featureList, eleSelected)) {
					eleSelected.data.featureEnabled = true;
				}
				return eleSelected;
			});

		}
	}

	enableDisableMainFeatureList(featureList:any) {
		let local = this;
			featureList = featureList.filter(function (ele: any) {

				let selected = local.model.selectedFeatures.filter(function (eleSelected: any) {
					return eleSelected.data.features.featureId == ele.data.features.featureId;
				});
				if (selected.length > 0) {
					ele.data.featureEnabled = true;
				}
				if (ele.children != null && ele.children.length > 0) {
					ele.children = local.enableDisableMainFeatureList(ele.children)
				}
				return ele;
			});

		return featureList;
	}

	isActionHidden(feature: any, action: any) {
		let availableActions = feature.enabledActions.filter(function (val: any) {
			return val.action == action;
		});
		if (availableActions.length > 0) {
			return false;
		}
		else {
			return true;
		}
	}

	checkMatchedFeatureInHierarchy(featureList: any,featureSelected:any) {
		let local = this;
		let result:boolean = false;
		let features: any = featureList.filter(function (ele: any) {
			let matched = featureSelected.data.features.featureId == ele.data.features.featureId;
			if (!matched && ele.children != null && ele.children.length > 0) {
				matched = local.checkMatchedFeatureInHierarchy(ele.children, featureSelected);
				if (matched && featureSelected.parent==null) {
					featureSelected.parent = ele;
					featureSelected.parent.partialSelected = true;
				}
			}
			return matched;
		});
		result = features.length > 0;
		return result;
	}

	onSelectFeature(rowData: any) {
		let local = this;
		if (rowData.data != undefined) {
			let selectedFeature = this.model.selectedFeatures.filter(function (ele: any) {
				return ele.data.features.featureId == rowData.features.featureId;
			});

			if (selectedFeature.length > 0) {
				selectedFeature[0].data.canAdd = selectedFeature[0].data.canEdit = selectedFeature[0].data.canView = selectedFeature[0].data.canExport = selectedFeature[0].data.canImport = true;
			} else {
				rowData.canAdd = rowData.canEdit = rowData.canView = rowData.canExport = rowData.canImport = false;
			}
		} else {
			if (this.model.selectedFeatures.length > 0) {
				let mainSelectedFeatures = this.model.selectedFeatures.filter(function (ele: any) {
					return ele.parent == null;
				});

				if (mainSelectedFeatures.length == this.featureList.length) {
					this.model.selectedFeatures = this.model.selectedFeatures.filter(function (ele: any) {
						if (local.selectedFeaturesClone == undefined || local.selectedFeaturesClone == null) {
							ele.data.featureEnabled = ele.data.canAdd = ele.data.canEdit = ele.data.canView = ele.data.canExport = ele.data.canImport = true;
							return ele;
						}
						else {
							let alreadySelected = local.selectedFeaturesClone.filter(function (eleClone: any) {
								return eleClone.data.features.featureId == ele.data.features.featureId;
							});
							if (alreadySelected.length <= 0) {
								ele.data.featureEnabled = ele.data.canAdd = ele.data.canEdit = ele.data.canView = ele.data.canExport = ele.data.canImport = true;
								return ele;
							}
							else {
								return ele;
							}
						}
					});
				}
				else {
					let selectedFeature:any;
					if (rowData.data == undefined)
						selectedFeature = this.model.selectedFeatures;
					else {
						selectedFeature = this.model.selectedFeatures.filter(function (ele: any) {
							return ele.data.features.featureId == rowData.features.featureId;
						});
					}         
					this.selectAllActionsInFeatures(selectedFeature);
					this.unSelectAllActionsInFeatures(this.featureList);
				}
			}
			else {
				this.uncheckAllActionsInFeatures(this.featureList);
			}
		}
		this.selectedFeaturesClone = this.serializeFeatureList(this.model.selectedFeatures);
		this.isDisabledBtn=false;
		if(rowData.featureEnabled == null) rowData.fullAccess=false;
	}

	unSelectAllActionsInFeatures(featureList: any) {
		let local = this;
		let unselectedFeatures = featureList.filter(function (ele: any) {
			if (ele.children != null && ele.children.length > 0) {
				local.unSelectAllActionsInFeatures(ele.children);
			}
			let unselected = local.model.selectedFeatures.filter(function (sEle: any) {
				return sEle.data.features.featureId == ele.data.features.featureId;
			});
			return (unselected.length <= 0);
		});

		unselectedFeatures.forEach(function (value: any) {
			value.data.featureEnabled = value.data.canAdd = value.data.canEdit = value.data.canView = value.data.canExport = value.data.canImport = null;
		});
	}

	uncheckAllActionsInFeatures(featureList: any) {
		let local = this;
		featureList.forEach(function (value: any) {
			value.data.featureEnabled = value.data.canAdd = value.data.canEdit = value.data.canView = value.data.canExport = value.data.canImport = null;
			if (value.children != null && value.children.length > 0) {
				local.uncheckAllActionsInFeatures(value.children);
			}
		});
	}

	selectAllActionsInFeatures(featureList: any) {
		let local = this;
		featureList.forEach(function (value: any) {
			value.data.featureEnabled = value.data.canAdd = value.data.canEdit = value.data.canView = value.data.canExport = value.data.canImport = true;
			if (value.children != null && value.children.length > 0) {
				local.selectAllActionsInFeatures(value.children);
			}
		});
	}
	serializeFeatureList(featureList: any) {
		let local = this;

		let result: any = [];
		featureList.forEach(function (value: any) {
			let res: any = {}
			res.data = JSON.parse(JSON.stringify(value.data));
			if (value.children != null && value.children.length > 0) {
				res.children = local.serializeFeatureList(value.children);
			}
			else {
				res.children = null;
			}
			result.push(res);
		});
		return result;
	}

	formReset() {
		this.model = {
			isActive: this.groupStatus,
			userGroup: []
		};
		this.featureList = [];
		this.getFeatureList();
		this.changeDetectorRef.detectChanges();
		this.setDefaultValues();
		this.isDisabledBtn = true;
	}
	setFullAccess(rowData: any) {
		this.isConfirmFullAccess = true;
		this.selectedFeature = rowData;
		this.message = rowData.isFullAccess ? "Are you sure you want to provide full access to the feature and the sub features under it?" : "Are you sure you want to revoke access to the feature and the sub features under it?";
	}
	OnFullAccess() {
		this.isDisabledBtn = false;
		this.isConfirmFullAccess = false;
	}
	OnCancelFullAccess(event: any) {
		this.isDisabledBtn = true;
		let index = this.featureList.findIndex(x => x.data?.features?.featureId == this.selectedFeature?.features?.featureId);
		if (index >= 0) {
			this.featureList[index].data.isFullAccess = this.featureList[index].data.isFullAccess ? false : true;
		}
		this.selectedFeature = null;
		this.isConfirmFullAccess = false;
	}

}
