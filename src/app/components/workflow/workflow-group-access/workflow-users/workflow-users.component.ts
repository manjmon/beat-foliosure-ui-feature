import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table'; 
import { FeaturesEnum } from 'src/app/services/permission.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
@Component({
  selector: 'app-workflow-users',
  templateUrl: './workflow-users.component.html',
  styleUrls: ['./workflow-users.component.scss']
})
export class WorkflowUsersComponent implements OnInit {
  feature: typeof FeaturesEnum = FeaturesEnum;
  @Input() scrollHeight: any;
  totalRecords: number;
  users = [];
  blockedTable: boolean = false;
  globalFilter: string = "";
  checkAll = false;
  usersToBeUpdated = [];
  selectedSubGroupId = 0;
  allUsers = [];
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  @Input() GroupDetails :any;
  groupData:any={groupID:-1};
  @ViewChild(Table) tblUser: Table;
  isOpenAddUser: boolean = false;
  headers = [{ field: "checkbox", header: "checkbox" },{header:'Email',field:'emailID'},{header:'Organization',field:'organization'},
  {header:'Country',field:'countryName'},{header:'Phone No',field:'phoneNumber'},
  {header:'Status',field:'status'},{header:'Action',field:'action'}];
  frozenProfitAndLossCols: any = [{ field: "checkbox", header: "checkbox" },{header:'Name',field:'fullName'}];
  updateUser: any = null;
  loading:boolean = false;
  @Output() ReloadGroups = new EventEmitter<any>();
  constructor(private accountService: AccountService, private toastrService: ToastrService,private miscService:MiscellaneousService) { }

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
  }

  ngOnChanges() {
    if(this.GroupDetails.groupID !== this.groupData.groupID){
      let data = JSON.parse(JSON.stringify(this.GroupDetails));
      this.getUsers(data,false);
      this.groupData = data;
    }
  }

  getUserList(event: any) {
    if (event == null) {
      event = { first: 0, globalFilter: null, sortField: null, sortOrder: 1, filterWithoutPaging:true };
    }
    event.filterWithoutPaging = true;
    this.blockedTable = true;
    this.accountService.getUserList({ paginationFilter: event }).subscribe(result => {
      let resp = result["body"];
      if (resp != null && result.code == "OK") {
        this.users = resp.userList;
        this.allUsers = resp.userList;
        this.totalRecords = resp.totalRecords;
        if(this.selectedSubGroupId !== 0){
          this.getUsers({groupID:this.selectedSubGroupId},true);
        }
      }
      else {
        this.users = [];
        this.allUsers = [];
        this.totalRecords = 0;
      }

      this.blockedTable = false;

    }, error => {
      this.blockedTable = false;
    });
  }

  loadUsersLazy(event: LazyLoadEvent) {
    this.getUserList(event);
  }

  getUsers(groupDeatils,keepFilter) {
    if(!keepFilter){
      this.globalFilter = "";
      this.checkAll = false;
      if(this.tblUser !== undefined)
      this.tblUser.filterGlobal("", 'contains');
    }
    if(groupDeatils.groupID !== undefined){
      if(groupDeatils.groupID !== 0){
        this.selectedSubGroupId = groupDeatils.groupID;
        let users = JSON.parse(JSON.stringify(this.users));
        users.forEach(x => {
          x.isSelected = x.groupDetails.length > 0 && x.groupDetails.find(x => x.groupID === groupDeatils.groupID) !== undefined;
        });
  
        users = this.sortUserList(users);
  
        this.users = users;
      }
      else{
        this.selectedSubGroupId = 0;
        let users = JSON.parse(JSON.stringify(this.allUsers));
        this.users = users;
        this.globalFilter = "";
        this.checkAll = false;
        this.tblUser.filterGlobal("", 'contains');
      }
    }


  }

  sortUserList(users){
    users.sort(function (x, y) {
      return (x.isSelected === y.isSelected) ? 0 : x.isSelected ? -1 : 1;
    });
    return users;
  }

  handleCheckBox(data, type) { 
    let usersToBeUpdated = JSON.parse(JSON.stringify(this.usersToBeUpdated));
    let grpId = this.selectedSubGroupId;
    let allUsers = this.allUsers;
    if (type === 'checkAll') {
      let isChecked = !this.checkAll;
      this.checkAll = isChecked;
      this.users.forEach((user) => {
        let userDetails = allUsers.find(x => x.userID === user.userID)
        user.isSelected = isChecked;
        if (usersToBeUpdated !== undefined && usersToBeUpdated.length > 0) {
          usersToBeUpdated = usersToBeUpdated.filter(x => x.userID !== user.userID);
        }
        if(isChecked){
          if(userDetails.groupDetails.find(x => x.groupID === grpId) === undefined){
            user.groupDetails = [];
            user.groupDetails.push({ groupID: grpId });
            usersToBeUpdated.push(user);
          }
        } else if (userDetails.groupDetails.length > 0 && userDetails.groupDetails.find(x => x.groupID === grpId) !== undefined){
          user.groupDetails = [];
          user.groupDetails.push({ groupID: grpId });
          usersToBeUpdated.push(user);
        }
      })
      this.usersToBeUpdated = usersToBeUpdated;
    } else {
      this.users.filter(function (user) {
        if (user === data) {
          user.isSelected = !data.isSelected;
          let userDetails = allUsers.find(x => x.userID === user.userID)
          if (usersToBeUpdated !== undefined && usersToBeUpdated.length > 0) {
            usersToBeUpdated = usersToBeUpdated.filter(x => x.userID !== data.userID);
          }
          if (user.isSelected && userDetails.groupDetails.find(x => x.groupID === grpId) === undefined) {
            user.groupDetails = [];
            user.groupDetails.push({ groupID: grpId });
            usersToBeUpdated.push(user);
          } else if (!user.isSelected && userDetails.groupDetails.length > 0 && userDetails.groupDetails.find(x => x.groupID === grpId) !== undefined) {
            user.groupDetails = [];
            user.groupDetails.push({ groupID: grpId });
            usersToBeUpdated.push(user);
          }
        }
        return user;
      });

      this.usersToBeUpdated = usersToBeUpdated;
      if (this.users.find(x => x.isSelected === false || x.isSelected === undefined) === undefined) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    }
  }

  mapUsers() {
    this.loading = true;
    this.accountService.UpdateUserSubGroups(this.usersToBeUpdated)
      .subscribe(
        data => {
          this.usersToBeUpdated = [];
          this.getUserList(null);
          this.toastrService.success('Selected users mapped successfully to the selected sub-group', "", { positionClass: "toast-center-center" });
          if(this.GroupDetails.groupName === "Admin"){
            this.ReloadGroups.emit();
          }
          this.loading = false;
        },
        error => {
          this.resetUserMapping();
          this.toastrService.error(error.message, "", { positionClass: "toast-center-center" });
          this.loading = false;
        });
        this.checkAll = false;
  }

  resetUserMapping(){
    this.users = JSON.parse(JSON.stringify(this.allUsers));
    this.getUsers({groupID:this.selectedSubGroupId},true);
    this.usersToBeUpdated = [];
    this.checkAll = false;
  }

  setMapButton(){
    if(this.selectedSubGroupId > 0 && this.usersToBeUpdated.length > 0){
      return false;
    } else{
      return true;
    }
  }
  closeUserPopup($event:any) {
    this.isOpenAddUser = false;
  }
  loadUsers(userChanges: boolean) {
    if (userChanges)
      this.getUserList(null);
  }
  editUser(user:any)
  {
    this.updateUser=user;
    this.isOpenAddUser = true;
  }
  exportUserList(){
		this.accountService.exportUserList().subscribe(response => this.miscService.downloadExcelFile(response));
  }
}
