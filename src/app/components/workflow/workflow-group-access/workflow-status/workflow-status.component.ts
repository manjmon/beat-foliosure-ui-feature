import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { WorkflowStatusService } from 'src/app/services/workflow-status.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-workflow-status',
  templateUrl: './workflow-status.component.html',
  styleUrls: ['./workflow-status.component.scss', '../workflow-users/workflow-users.component.scss', '../workflow-groups/workflow-groups.component.scss']
})
export class WorkflowStatusComponent implements OnInit {
  @Input() scrollHeight: any;
  StatusList = [];
  isAddStatus = false;
  newStatusName = '';
  newStatusDesc = '';
  AddOrUpdateStatusPopupTitle = "";
  AddOrUpdateStatusPopupButton = "";
  StatusToBeUpdatedOrDeleted = undefined;
  isDescPopup = false;
  popUpToasterMessage = '';
  isToasterSuccess = true;
  showDelStatusConfirmation = false;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  showMoveProfilesPopUp = false;
  moveProfilesMsg = "";
  popupToasterStyle = "";
  selectedSubGroupId = 0;
  @Input() GroupDetails: any;
  groupData: any = { groupID: -1 };
  StatuslistToBeMappedOrUnmapped = [];
  workflowStatusList = [];
  disableMapBtn = true;
  disableResetBtn = true;
  loading:boolean = false;
  constructor(private workflowStatusService: WorkflowStatusService, private toastrService: ToastrService) { }

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
    this.getStatusList();
  }

  ngOnChanges() {
    if (this.GroupDetails.groupID !== this.groupData.groupID) {
      let data = JSON.parse(JSON.stringify(this.GroupDetails));
      this.getMappedStatus(data);
      this.groupData = data;
    }
  }

  getStatusList() {
    this.workflowStatusService.getWorkflowStatus().subscribe((result: any) => {
      this.StatusList = result;
      this.workflowStatusList = result;
      if (this.selectedSubGroupId !== 0) {
        this.getMappedStatus({ groupID: this.selectedSubGroupId });
      }
    }, error => {
    });
  }

  loadUsersLazy($event) {
    this.getStatusList();
  }

  handleCheckBox(status) {
    let StatuslistToBeMappedOrUnmapped = JSON.parse(JSON.stringify(this.StatuslistToBeMappedOrUnmapped));
    let grpId = this.selectedSubGroupId;
    let StatusList = this.StatusList;

    this.StatusList.filter(function (item) {
      if (item === status) {
        item.isSelected = !status.isSelected;
        let statusData = StatusList.find(x => x.statusId === item.statusId);
        if (statusData.groupDetails === null) {
          statusData.groupDetails = [];
        }
        if (StatuslistToBeMappedOrUnmapped !== undefined && StatuslistToBeMappedOrUnmapped.length > 0) {
          StatuslistToBeMappedOrUnmapped = StatuslistToBeMappedOrUnmapped.filter(x => x.statusId !== status.statusId);
        }
        if ((item.isSelected && statusData.groupDetails.find(x => x !== null && x.groupID === grpId) === undefined) ||
          (!item.isSelected && statusData.groupDetails.length > 0 && statusData.groupDetails.find(x => x !== null && x.groupID === grpId) !== undefined)) {
          StatuslistToBeMappedOrUnmapped.push({ groupID: grpId, statusId: item.statusId });
        }
      }
      return item;
    });

    if (this.selectedSubGroupId > 0 && StatuslistToBeMappedOrUnmapped.length > 0) {
      this.disableMapBtn = false;
      this.disableResetBtn = false;
    } else {
      this.disableMapBtn = true;
      this.disableResetBtn = true;
    }
    this.StatuslistToBeMappedOrUnmapped = StatuslistToBeMappedOrUnmapped;
  }

  ShowAddStatusPopup() {
    this.isAddStatus = true;
    this.AddOrUpdateStatusPopupTitle = "Add Status";
    this.AddOrUpdateStatusPopupButton = "Add";
  }

  CloseAddStatusPopup() {
    this.resetAddStatusPopup();
    this.isAddStatus = false;
  }

  resetAddStatusPopup() {
    this.newStatusDesc = '';
    this.newStatusName = '';
    this.StatusToBeUpdatedOrDeleted = undefined;
    this.popUpToasterMessage = '';
    this.popupToasterStyle = '';
    this.getStatusList();
  }

  onAddStatusChange(name) {
    name = name.trim();
    this.popUpToasterMessage = '';
    this.popupToasterStyle = '';
    this.newStatusName = name;
  }

  onEditStatus(status) {
    this.StatusToBeUpdatedOrDeleted = status;
    this.newStatusName = status.name;
    this.newStatusDesc = status.description;
    this.AddOrUpdateStatusPopupTitle = "Update Status";
    this.AddOrUpdateStatusPopupButton = "Update";
    this.isAddStatus = true;
  }

  addOrUpdateWorkflowStatus() {
    this.loading = true;
    this.popUpToasterMessage = '';
    this.popupToasterStyle = '';
    let status = { name: '', description: '' };
    if (this.StatusToBeUpdatedOrDeleted === undefined) {
      status = { name: this.newStatusName, description: this.newStatusDesc };
    } else {
      status = this.StatusToBeUpdatedOrDeleted;
      status.name = this.newStatusName;
      status.description = this.newStatusDesc;
    }
    this.workflowStatusService.addOrUpdateWorkflowStatus(status).subscribe((result: any) => {
      if (result.flag !== -1) {
        this.isToasterSuccess = true;
        if (result.flag === 1) {
          this.resetAddStatusPopup();
        }
      } else {
        this.StatusToBeUpdatedOrDeleted = undefined;
        this.isToasterSuccess = false;
      }
      this.popUpToasterMessage = result.message;
      this.popupToasterStyle = 'custom-toast-addStatusModel';
      this.closeAfterUpdate();
      this.loading = false;
    }, error => {
      this.isToasterSuccess = false;
      this.popUpToasterMessage = "Something went wrong";
      this.popupToasterStyle = 'custom-toast-addStatusModel';
      this.closeAfterUpdate();
      this.loading = false;
    });
  }

  closeAfterUpdate() {
    if (this.StatusToBeUpdatedOrDeleted !== undefined) {
      this.toastrService.success("Status updated successfully", "", { positionClass: "toast-center-center-status" });
      this.CloseAddStatusPopup();
    }
  }

  openDescPopUp(status) {
    this.newStatusDesc = status.description;
    this.isDescPopup = true;
  }

  closeDescPopUp() {
    this.newStatusDesc = '';
    this.isDescPopup = false;
  }

  onDeleteStatus(status) {
    this.StatusToBeUpdatedOrDeleted = status;
    this.showDelStatusConfirmation = true;
  }

  closeDelStatusConfirmation() {
    this.StatusToBeUpdatedOrDeleted = undefined;
    this.showDelStatusConfirmation = false;
  }

  deleteStatus() {
    this.workflowStatusService.deleteWorkflowStatus(this.StatusToBeUpdatedOrDeleted.statusId).subscribe((result: any) => {
      if (result.flag === -1) {
        this.toastrService.success(result.message, "", { positionClass: "toast-center-center-status" });
      } else {
        this.moveProfilesMsg = result.message;
        this.showMoveProfilesPopUp = true;
      }
      this.getStatusList();
    }, error => {
      this.toastrService.error("Something went wrong", "", { positionClass: "toast-center-center-status" });
    });
    this.closeDelStatusConfirmation();
  }

  closeMoveProfilesPopUp() {
    this.moveProfilesMsg = "";
    this.showMoveProfilesPopUp = false;
  }

  getMappedStatus(groupDeatils) {
    if (groupDeatils.groupID !== undefined) {
      if (groupDeatils.groupID !== 0) {
        this.selectedSubGroupId = groupDeatils.groupID;
        let statusList = JSON.parse(JSON.stringify(this.StatusList));
        statusList.forEach(x => {
          if(x.groupDetails !== undefined && x.groupDetails !== null){
            x.isSelected =  x.groupDetails.length > 0 && x.groupDetails.find(y => y !== null && y.groupID === groupDeatils.groupID) !== undefined;
          } else{
            x.isSelected = false;
          }
        });
        this.StatusList = statusList;
      }
      else {
        this.selectedSubGroupId = 0;
        let statusList = JSON.parse(JSON.stringify(this.workflowStatusList));
        this.StatusList = statusList;
      }
    }
  }

  mapOrUnmapStatus() {
    this.workflowStatusService.MapStatusToGroup(this.StatuslistToBeMappedOrUnmapped)
      .subscribe(
        data => {
          this.StatuslistToBeMappedOrUnmapped = [];
          this.getStatusList();
          this.toastrService.success(data.message, "", { positionClass: "toast-center-center" });
          this.disableMapBtn = true;
          this.disableResetBtn = true;
        },
        error => {
          this.resetStatusMapping();
          this.toastrService.error(error.message, "", { positionClass: "toast-center-center" });
        });
  }

  resetStatusMapping(){
    this.disableMapBtn = true;
    this.disableResetBtn = true;
    this.StatusList = JSON.parse(JSON.stringify(this.workflowStatusList));
    this.getMappedStatus({groupID:this.selectedSubGroupId});
    this.StatuslistToBeMappedOrUnmapped = [];
  }

}
