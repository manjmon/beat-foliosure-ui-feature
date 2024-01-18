import { ChangeDetectorRef,ViewEncapsulation, Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { AccountService } from "../../services/account.service";
import { FirmService } from "../../services/firm.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { ITab } from "projects/ng-neptune/src/lib/Tab/tab.model";

@Component({
  selector: "add-firm",
  templateUrl: "./add-firm.component.html",
  styleUrls: ["./add-firm.component.scss"],
  providers: [ConfirmationService],
  encapsulation: ViewEncapsulation.None
})
export class AddFirmComponent implements OnInit {
  firmForm: FormGroup;
  countryList: any[];
  cityList: any[];
  tabList: ITab[] = [];
  tabName: string;
  stateList: any[];
  deleteConfirmationMessage: string =
    "Are you sure that you want to delete this record?";
  id: any;
  title: string = "Create";
  resetText: string = "Reset";
  firmStatus: boolean = true;
  masterModel: any;
  masterModelClone: any;
  msgTimeSpan: number;
  firmEmployee: any = {};
  geographicLocation: any = { isHeadquarter: false };
  model: any = {
    geographicLocations: [],
    firmEmployees: [],
  };
  designationList: any[];
  loading = false;
  sourceURL: any;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  sideNavWidth:any ="";
  constructor(
    private confirmationService: ConfirmationService,
    private accountService: AccountService,
    private firmService: FirmService,
    private _avRoute: ActivatedRoute,
    protected changeDetectorRef: ChangeDetectorRef,
    private toastrService: ToastrService,
    private miscService: MiscellaneousService
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.firmService.getMasterFirmModel().subscribe(
      (result) => {
        this.masterModel = result["body"];
        this.masterModelClone = JSON.parse(JSON.stringify(result["body"]));
      }
    );
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
  }

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
    this.sourceURL = this.miscService.GetPriviousPageUrl();

    if (this.id != undefined) {
      this.loading = true;
      this.title = "Update";
      this.resetText = "Reload";
    } else {
      this.loading = false;
    }
    this.getTabList();
    this.miscService.getDesignationList().subscribe({
      next: (result) => {
        this.designationList = result["body"];
        this.setDefaultValues();
      },
      error:(error) => {
      }
    });
  }
  getSideNavWidth()
  {
    this.sideNavWidth = "calc(100% - " + this.miscService.getSideBarWidth() + ")";
  }
  onResized($event)
  {
    this.getSideNavWidth();
  }
  getTabList() {
    this.tabList.push({
      active: true,
      name: "Geographic-Locations",
      aliasname:"Geographic Locations"
    });
    this.tabList.push({
      active: false,
      name: "Investment-Professionals",
      aliasname:"Investment Professionals"
    });
    this.tabName = this.tabList[0].name;
  }
  selectTab(tab: ITab){
    // deactivate all tabs
    this.tabList.forEach(tab => tab.active = false);
    tab.active = true;
    this.tabName=tab.name;
  }

  setDefaultValues() {
    if (this.id != undefined) {
      this.loading = true;
      //get user details by user id
      this.firmService.getFirmById({ Value: this.id }).subscribe({
        next:(result) => {
          let resp = result["body"];

          if (resp != null && result.code == "OK") {
            this.model = resp;

            if (this.model.geographicLocations != null) {
              this.model.geographicLocations.forEach(function (value: any) {
                value.uniquelocationID = value.locationID;
              });
            }
          } else {
            if (resp.status != null && resp.status.message != "") {
              this.toastrService.error(resp.status.message,"",{positionClass:"toast-center-center"});
            }
          }

          this.loading = false;
        },
        error:(error) => {
          this.loading = false;
        }
    });
    }
  }

  addGeographicLocation(form: any) {
    if (form.valid) {
      if (this.geographicLocation.country != undefined) {
        let isHeadquarterExist = this.model.geographicLocations.filter(
          function (ele: any) {
            ele.isHeadquarter= true;
            return ele.isHeadquarter;
          }
        );
        //
        let res = false;
        let isLocationExist = this.model.geographicLocations.filter(function (
          ele: any
        ) {
          res = this.validationGeographicLocations(ele,res);
          return res;
        });
        if (isLocationExist.length == 0) {
          this.isLocationExist(isHeadquarterExist, form);
        } else {
          this.toastrService.error("Same location is already added for the firm", "", { positionClass: "toast-center-center" });
        }
      }
    } else {
      this.toastrService.error("Please select the required fields", "", { positionClass: "toast-center-center" });
    }
  }
  validationGeographicLocations(ele:any,res:any){
    let local = this;
    if (ele.city && local.geographicLocation.city) {
      res = ele.city.cityId == local.geographicLocation.city.cityId;
    } else if (ele.city == local.geographicLocation.city) {
      if (ele.state && local.geographicLocation.state) {
        res = ele.state.stateId == local.geographicLocation.state.stateId;
      } else if (ele.state == local.geographicLocation.state) {
        if (ele.country && local.geographicLocation.country) {
          res =
            ele.country.countryId ==
            local.geographicLocation.country.countryId;
        } else if (ele.country == local.geographicLocation.country) {
          res = this.geographicLocationCountry(res,ele,local)
        }
      }
    }
    return res
  }
  geographicLocationCountry(res:any,ele:any,local:any){
    if (ele.region && local.geographicLocation.region) {
      res =
        ele.region.regionId ==
        local.geographicLocation.region.regionId;
    } else {
      res = ele.region == local.geographicLocation.region;
    }
    return res
  }
  isLocationExist(isHeadquarterExist:any,form: any){
    if (
      isHeadquarterExist.length == 0 ||
      !this.geographicLocation.isHeadquarter
    ) {
      this.geographicLocation.uniquelocationID = 1;
      if (this.model.geographicLocations.length > 0) {
        let maxVal = this.model.geographicLocations.reduce(function (
          prev: any,
          current: any
        ) {
          return prev.uniquelocationID > current.uniquelocationID
            ? prev
            : current;
        });
        this.geographicLocation.uniquelocationID =
          maxVal.uniquelocationID + 1;
      }
      this.model.geographicLocations.push(
        JSON.parse(JSON.stringify(this.geographicLocation))
      );

      this.clearGeographicLocation(form);
    } else {
      this.toastrService.error("You have already selected the headquarter location for the firm","",{positionClass:"toast-center-center"});
    }
  }
  clearGeographicLocation(geoForm: any) {
    this.geographicLocation = {};
    setTimeout(
      function (local: any) {
        local.masterModel = JSON.parse(JSON.stringify(local.masterModelClone));
        local.geographicLocation = { isHeadquarter: false };
        local.changeDetectorRef.detectChanges();
      },
      10,
      this
    );
  }
  removeLocation(locationId: any) {
    this.confirmationService.confirm({
      message: this.deleteConfirmationMessage,
      accept: () => {
        this.model.geographicLocations = this.model.geographicLocations.filter(
          function (ele: any) {
            return locationId != ele.uniquelocationID;
          }
        );
      },
    });
  }
  addEmployees(form: NgForm) {
    if (!form.valid) {
      for (let eachControl in form.form.controls) {
        (<FormControl>form.form.controls[eachControl]).markAsDirty();
      }
      return;
    }
    if (this.employeeEditMode) {
      this.updateEmployee(form);
    } else if (
      this.firmEmployee.employeeName != undefined &&
      this.firmEmployee.emailId != undefined
    ) {
      let empEmailId = this.firmEmployee.emailId;
      let isEmployeeExist = this.model.firmEmployees.filter(function (
        ele: any
      ) {
        return ele.emailId.toLowerCase() != empEmailId.toLowerCase();
      });

     this.isEmployeeExist(isEmployeeExist,form)
    } else {
      this.toastrService.error("Please select the required fields","",{positionClass:"toast-center-center"});
    }
  }
  isEmployeeExist(isEmployeeExist:any,form: NgForm){
    if (this.model.firmEmployees.length == 0 || isEmployeeExist.length != 0) {
      this.firmEmployee.employeeId = 1;
      if (this.model.firmEmployees.length > 0) {
        let maxVal = this.model.firmEmployees.reduce(function (
          prev: any,
          current: any
        ) {
          return prev.employeeId > current.employeeId ? prev : current;
        });
        this.firmEmployee.employeeId = maxVal.employeeId + 1;
      }
      this.model.firmEmployees.push(this.firmEmployee);
      this.clearEmployees(form);
    } else {
      this.toastrService.error("Employee with the same email id is already added in the list","",{positionClass:"toast-center-center"});
    }
  }
  clearEmployees(form: NgForm) {
    this.employeeEditMode = false;
    this.firmEmployee = {};
    for (let eachControl in form.form.controls) {
      (<FormControl>form.form.controls[eachControl]).markAsPristine();
    }
  }
  removeEmployee(emailId: any) {
    this.confirmationService.confirm({
      message: this.deleteConfirmationMessage,
      accept: () => {
        this.model.firmEmployees = this.model.firmEmployees.filter(function (
          ele: any
        ) {
          return ele.emailId.toLowerCase() != emailId.toLowerCase();
        });
      },
    });
  }

  saveFirm(f: any) {
    if (f.valid) {
      this.loading = true;
        if (this.title == "Create") {
          this.firmService.addFirm(this.model).subscribe({
            next:(data) => {
              if (data.code == "OK") {
                this.formReset(f);
                this.toastrService.success(data.message,"",{positionClass:"toast-center-center"});
              }
              else
                this.toastrService.error(data.message,"",{positionClass:"toast-center-center"});
              this.loading = false;
            },
            error:(error) => {
              this.toastrService.error(error.message,"",{positionClass:"toast-center-center"});
              this.loading = false;
            }
        });
        } else if (this.title == "Update") {
          this.firmService
            .addFirm(this.model)
            // this.firmService.updateFirm(this.model)
            .subscribe({
              next:(data) => {
                this.loading = false;
                  this.toastrService.success(data.message,"",{positionClass:"toast-center-center"});
              },
              error: (error) => {
                this.toastrService.error(error.message,"",{positionClass:"toast-center-center"});
                this.loading = false;
              }
        });
        }
     // } 
      // else {
      //   this.loading = false;
      //   this.toastrService.error("Please select geographic location for the firm","",{positionClass:"toast-center-center"});
      // }
    }
  }

  validateGeographicLocation(): boolean {
    if (
      this.model.geographicLocations != undefined &&
      this.model.geographicLocations != ([]) &&
      this.model.geographicLocations.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  formReset(f: any) {
    f.resetForm();
    this.changeDetectorRef.markForCheck();
    this.geographicLocation = { isHeadquarter: false };

    this.model = {
      geographicLocations: [],
      firmEmployees: [],
    };
    this.setDefaultValues();
  }

  employeeEditMode: boolean = false;
  removeFirmEmployee(employee: any) {
    this.confirmationService.confirm({
      message: this.deleteConfirmationMessage,
      accept: () => {
        this.model.firmEmployees = this.model.firmEmployees.filter(
          function (ele: any) {
            return employee.employeeId != ele.employeeId;
          }
        );
      },
    });
  }
  editFirmEmployee(employee: any) {
    this.employeeEditMode = true;
    this.firmEmployee = JSON.parse(JSON.stringify(employee));
    let local = this;
    if (
      this.firmEmployee.designation != null &&
      this.firmEmployee.designation.designationId > 0
    ) {
      this.firmEmployee.designation = this.masterModel.designationList.filter(
        function (element: any, index: any) {
          return (
            element.designationId ==
            local.firmEmployee.designation.designationId
          );
        }
      )[0];
    }
  }

  updateEmployee(form: NgForm) {
    if (
      this.firmEmployee.employeeName != undefined &&
      this.firmEmployee.emailId != undefined
    ) {
      let employeeId = this.firmEmployee.employeeId;

      let existingEmployee = this.model.firmEmployees.filter(function (
        ele: any
      ) {
        return ele.employeeId == employeeId;
      });
      let emailId = this.firmEmployee.emailId;
      let isEmailExist = this.model.firmEmployees.filter(function (ele: any) {
        return (
          ele.emailId.toLowerCase() == emailId.toLowerCase() &&
          ele.employeeId != employeeId
        );
      });

      if (existingEmployee.length != 0 && isEmailExist.length == 0) {
        this.changeDetectorRef.detectChanges();
        this.model.firmEmployees[
          this.model.firmEmployees.indexOf(existingEmployee[0])
        ] = this.firmEmployee;
        this.clearEmployees(form);
      } else {
        this.toastrService.error("Employee with the same email id is already added in the list","",{positionClass:"toast-center-center"});
      }
    } else {
      this.toastrService.error("Please select the required fields","",{positionClass:"toast-center-center"});
    }
  }
}
