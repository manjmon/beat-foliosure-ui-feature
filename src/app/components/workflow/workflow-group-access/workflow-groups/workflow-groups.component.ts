import { Component, HostListener, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { WorkflowAccessService } from 'src/app/services/workflow-access.service';

@Component({
  selector: 'app-workflow-groups',
  templateUrl: './workflow-groups.component.html',
  styleUrls: ['./workflow-groups.component.scss']
})
export class WorkflowGroupsComponent implements OnInit, AfterViewInit {
  globalFilter: string = "";
  windowHeight = 0;
  groupList: any = [];
  isOpenPopup = false;
  isDescPopup = false;
  placeholderGroupName: string = "Enter Group Name";
  disableAdd = true;
  disableSubGroupAdd = true;
  addGroupName: string = "";
  addGroupDesc: string = "";
  addSubGroupName: string = "";
  addSubGroupDesc: string = "";
  popUpDescription: string = "";
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  isGroupEdit: boolean = false;
  isSubGroupEdit: boolean = false;
  group: any;
  subGroup: any;
  groupTitle = "Add Group"
  primaryButtonName = "Add";
  subGroupTitle = "Add Sub Group"
  subGroupprimaryButtonName = "Add";
  isDeletePopup = false;
  isDeleteSubGroupPopup = false;
  isOpenSubGroupPopup = false;
  masterGroup: any;
  isStatusPopup = false;
  statusName = "";
  isError = false;
  ErrorMessage = "";
  activeSubGroup: any;
  activeGroup: any;
  isPreferenceOpen: any;
  isAdmin = false;
  resultMessage: string = "";
  moveProfilesMsg: string = "";
  showMoveProfilesPopUp = false;
  @Output() GetUsersByGroup = new EventEmitter<any>();
  @Input() isReloadGroups = false;
  @Output() unsetReloadGroups = new EventEmitter<any>();
  constructor(private workflowAccessService: WorkflowAccessService, private toastrService: ToastrService) { }

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
    this.getGroups();
    this.setAdmin();
  }
  ngOnChanges() {
    if (this.isReloadGroups) {
      this.getGroups();
      this.setAdmin();
      this.isReloadGroups = false;
      this.unsetReloadGroups.emit();
    }
  }
  ngAfterViewInit() {
    this.windowHeight = window.innerHeight - 213;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowHeight = window.innerHeight - 213;
  }

  setAdmin() {
    this.workflowAccessService.checkIfAdmin().subscribe((res: any) => {
      this.isAdmin = res.value.body;
    }, error => {
    });
  }

  getGroups() {
    let filter: any = {};
    filter.first = 0;
    filter.PaginationFilter = {};
    filter.PaginationFilter.GlobalFilter = this.globalFilter;
    filter.globalFilter = null
    filter.rows = 0;
    filter.sortOrder = 1;
    this.workflowAccessService.getGroups(filter).subscribe((res: any) => {
      this.groupList = res.body || [];
      let group = this.groupList.find(x => x.masterGroupID === this.activeGroup?.masterGroupID);
      if (group !== undefined) {
        if (this.activeGroup !== undefined) {
          group.isExpanded = this.activeGroup?.isExpanded;
        } else {
          group.isExpanded = false;
        }
        let index = this.groupList.indexOf(group);
        this.groupList[index] = group;
        if (this.activeGroup !== undefined) {
          let subGrp = this.activeGroup.groups.find(x => x.isSelected);
          if (subGrp !== undefined) {
            let sGrp = this.groupList[index].groups.find(x => x.groupID === subGrp.groupID);
            let sIndex = this.groupList[index].groups.indexOf(group);
            sGrp.isSelected = subGrp.isSelected;
            this.groupList[index].groups[sIndex] = sGrp;
          }
        }

      }
    }, error => {
    });
  }
  isExpand(groups: any) {
    if (groups.isExpanded)
      groups.isExpanded = false;
    else
      groups.isExpanded = true;
  }
  search() {
    this.getGroups();
  }
  createGroup() {
    let group: any = {};
    if (this.isGroupEdit) {
      group = this.group;
    }
    group.MasterGroupName = this.addGroupName;
    group.Description = this.addGroupDesc;
    this.workflowAccessService.createGroup(group).subscribe((res: any) => {
      if (res.value.code == "OK") {
        this.toastrService.success(this.isGroupEdit ? 'Group updated successfully' : res.value.message, "", { positionClass: "toast-center-center" });
        this.getGroups();
        this.clearGroup();
        this.isGroupEdit ? this.isOpenPopup = false : '';
      }
      if (res.value.code == "Conflict") {
        this.isError = true;
        this.ErrorMessage = "Group already exist.";
      }
    }, error => {
      this.toastrService.error(error.value.message, "", { positionClass: "toast-center-center" });
    });
  }
  clearGroup() {
    this.group = {};
    this.addGroupName = "";
    this.addGroupDesc = "";
    this.disableAdd = true;
    this.groupTitle = "Add Group"
    this.primaryButtonName = "Add";
    this.ErrorMessage = "";
    this.isError = false;
  }
  clearSubGroup() {
    this.subGroup = {};
    this.masterGroup = {};
    this.addSubGroupName = "";
    this.addSubGroupDesc = "";
    this.disableSubGroupAdd = true;
    this.subGroupTitle = "Add Sub Group"
    this.subGroupprimaryButtonName = "Add";
    this.ErrorMessage = "";
    this.isError = false;
  }
  OnCreateGroup() {
    this.isOpenPopup = true;
    this.isGroupEdit = false;
  }
  OnCreateSubGroup(group: any) {
    this.masterGroup = group;
    this.isOpenSubGroupPopup = true;
  }
  OnSaveGroup(event: any) {
    this.createGroup();
  }
  OnSaveSubGroup(event: any) {
    this.createSubGroup();
  }
  OnCancelGroup(event: any) {
    this.isOpenPopup = false;
    this.clearGroup();
  }
  OnCancelSubGroup(event: any) {
    this.isOpenSubGroupPopup = false;
    this.clearSubGroup();
  }
  editSubGroup(subgroup: any) {
    this.isSubGroupEdit = true;
    this.isOpenSubGroupPopup = true;
    this.disableSubGroupAdd = true;
    this.subGroup = subgroup;
    this.subGroupprimaryButtonName = "Update";
    this.subGroupTitle = "Update Group";
    this.addSubGroupName = subgroup.groupName;
    this.addSubGroupDesc = subgroup.description;
  }
  setStatus(subgroup: any) {
    this.subGroup = subgroup;
    this.statusName = subgroup.isActive ? 'Inactive' : 'active';
    this.isStatusPopup = true;
  }
  deleteSubGroup(subgroup: any) {
    this.isDeleteSubGroupPopup = true;
    this.subGroup = subgroup;
  }
  editGroup(group: any) {
    this.isGroupEdit = true;
    this.isOpenPopup = true;
    this.disableAdd = true;
    this.group = group;
    this.primaryButtonName = "Update";
    this.groupTitle = "Update Group";
    this.addGroupName = group.masterGroupName;
    this.addGroupDesc = group.description;
  }
  deleteGroup(group: any) {
    this.isDeletePopup = true;
    this.group = group;
  }
  viewDescription(group: any) {
    this.popUpDescription = group.description;
    this.isDescPopup = true;
  }
  closeDescPopUp() {
    this.isDescPopup = false;
  }
  onDescChange() {
    this.checkValidation();
  }
  onSubGroupDescChange() {
    this.checkSubGroupValidation();
  }
  onGroupNameChange(event: any) {
    this.addGroupName = event?.target?.value;
    this.checkValidation();

  }
  onSubGroupNameChange(event: any) {
    this.addSubGroupName = event.target.value;
    this.checkSubGroupValidation();

  }
  onGroupNameUpdate() {
    if (this.isGroupEdit) {
      if (this.group.masterGroupName === this.addGroupName && (this.group.description === this.addGroupDesc)) {
        this.disableAdd = true;
      } else {
        this.disableAdd = false;
      }
    }
  }
  onSubGroupNameUpdate() {
    if (this.isSubGroupEdit) {
      if (this.subGroup.groupName === this.addSubGroupName && (this.subGroup.description === this.addSubGroupDesc)) {
        this.disableSubGroupAdd = true;
      } else {
        this.disableSubGroupAdd = false;
      }
    }
  }
  checkValidation() {
    if (this.addGroupName.length > 0) {
      this.disableAdd = false;
    }
    else {
      this.disableAdd = true;
    }
  }
  checkSubGroupValidation() {
    if (this.addSubGroupName.length > 0) {
      this.disableSubGroupAdd = false;
    }
    else {
      this.disableSubGroupAdd = true;
    }
  }
  OnDeleteGroup(event: any) {
    this.group.IsDeleted = true;
    this.workflowAccessService.createGroup(this.group).subscribe((res: any) => {
      this.resultMessage = res.value.message;
      if (res.value.code == "OK") {
        if (!this.resultMessage.startsWith("There")) {
          this.toastrService.success("Group deleted successfully.", "", { positionClass: "toast-center-center" });
          this.getGroups();
          this.clearGroup();
          this.isDeletePopup = false;
          this.GetUsersByGroup.emit({ groupID: 0 });
        } else {
          this.showMoveProfilesPopUp = true;
          this.moveProfilesMsg = this.resultMessage;
          this.resultMessage = "";
          this.isDeletePopup = false;
        }
      }
    }, error => {
      this.toastrService.error(error.value.message, "", { positionClass: "toast-center-center" });
    });
  }
  OnDeleteSubGroup(event: any) {
    this.subGroup.IsDeleted = true;
    this.workflowAccessService.createSubGroup(this.subGroup).subscribe((res: any) => {
      this.resultMessage = res.value.message;
      if (res.value.code == "OK") {
        if (!this.resultMessage.startsWith("There")) {
          this.toastrService.success("Sub Group deleted successfully.", "", { positionClass: "toast-center-center" });
          this.getGroups();
          this.clearSubGroup();
          this.isDeleteSubGroupPopup = false;
          this.GetUsersByGroup.emit({ groupID: 0 });
        } else {
          this.showMoveProfilesPopUp = true;
          this.moveProfilesMsg = this.resultMessage;
          this.resultMessage = "";
          this.isDeleteSubGroupPopup = false;
        }
      }
    }, error => {
      this.toastrService.error(error.value.message, "", { positionClass: "toast-center-center" });
    });
  }

  closeMoveProfilesPopUp() {
    this.showMoveProfilesPopUp = false;
    this.moveProfilesMsg = "";
  }
  OnCancelDeleteGroup(event: any) {
    this.isDeletePopup = false;
    this.clearGroup();
  }
  OnCancelDeleteSubGroup(event: any) {
    this.isDeleteSubGroupPopup = false;
    this.clearSubGroup();
  }
  createSubGroup() {
    let subGroup: any = {};
    if (this.isSubGroupEdit) {
      subGroup = this.subGroup;
    }
    else {
      subGroup.MasterGroupId = this.masterGroup.masterGroupID;
    }
    subGroup.GroupName = this.addSubGroupName;
    subGroup.Description = this.addSubGroupDesc;
    this.workflowAccessService.createSubGroup(subGroup).subscribe((res: any) => {
      if (res.value.code == "OK") {
        this.toastrService.success(this.isSubGroupEdit ? 'Sub Group updated successfully' : 'Sub Group added successfully', "", { positionClass: "toast-center-center" });
        this.getGroups();
        this.clearSubGroup();
        this.isSubGroupEdit ? this.isOpenSubGroupPopup = false : '';
      }
      if (res.code == "Conflict") {
        this.isError = true;
        this.ErrorMessage = "Sub group already exists";
      }
    }, error => {
      this.toastrService.error(error.value.message, "", { positionClass: "toast-center-center" });
    });
  }
  OnStatusGroup(event: any) {
    this.subGroup.IsActive = this.subGroup.isActive ? false : true;
    this.workflowAccessService.createSubGroup(this.subGroup).subscribe((res: any) => {
      if (res.value.code == "OK") {
        this.toastrService.success("Sub Group updated successfully.", "", { positionClass: "toast-center-center" });
        this.getGroups();
        this.clearSubGroup();
        this.statusName = "";
        this.isStatusPopup = false;
      }
    }, error => {
      this.toastrService.error(error.value.message, "", { positionClass: "toast-center-center" });
    });
  }
  OnCancelStatusGroup(event: any) {
    this.isStatusPopup = false;
    this.statusName = "";
    this.clearSubGroup();

  }

  setActiveGroup(subgroup: any, group: any, isPreferenceOpen: any) {
    if ((this.activeSubGroup === undefined) || ((!this.isDescPopup || (this.isDescPopup && this.activeSubGroup.groupID !== subgroup.groupID)) && (!isPreferenceOpen || (isPreferenceOpen && this.activeSubGroup.groupID !== subgroup.groupID)))) {
      subgroup.isSelected = true;
      this.activeGroup = group;
      if (subgroup.isSelected) {
        this.activeSubGroup = subgroup;
        this.setSelectedGroup(subgroup);
        this.GetUsersByGroup.emit(subgroup);
      }
      else {
        this.activeSubGroup = {};
        this.GetUsersByGroup.emit({ groupID: 0 });
      }
    }

  }
  setSelectedGroup(subgroup: any) {
    for (let i = 0; i < this.groupList.length; i++) {
      if (this.groupList[i]?.groups.length > 0) {
        for (let j = 0; j < this.groupList[i].groups.length; j++) {
          if (subgroup.groupID != this.groupList[i].groups[j].groupID) {
            this.groupList[i].groups[j].isSelected = false;
          }
        }
      }
    }
  }

}
