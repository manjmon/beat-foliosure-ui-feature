import { Router } from '@angular/router';
import { Component, OnInit } from "@angular/core";
import { IdleService, IdleWarningStates } from "ngx-idle-timeout";
import { OidcConfig } from "src/app/configuration/oidcConfig";
import { AccountService } from "src/app/services/account.service";
import { CryptoService } from "src/app/services/crypto.service";
import { OidcAuthService } from "src/app/services/oidc-auth.service";
import { PermissionService } from "src/app/services/permission.service";
import { FeaturesImageEnum } from "../../services/permission.service";
import { DataAnalyticsConstants } from 'src/app/common/constants';

@Component({
  selector: "master",
  templateUrl: "./master.component.html",
  styleUrls: ["./master.component.scss"],
})
export class MasterComponent implements OnInit {
  isIdsEnabled: boolean;
  isPermissionAvailable:boolean = true;
  userName: any = "A";
  userId: any;
  idleTimer = true;
  isLoader:boolean = true;
  navbarString="nep-sidebar-expanded";
  panelOpenState = true
  
  isClientUser = false;
  userEmail:string="";
  featureList:any = [];
  featureImage: typeof FeaturesImageEnum = FeaturesImageEnum;
  sidenavWidth = 4.68;
  displayOpenOption = false
  
  constructor(private ids:OidcAuthService,
    private accountService:AccountService,
    private cryptoService:CryptoService,
    private permissionService: PermissionService,
    private _idleService: IdleService,
    private router:Router){}
  ngOnInit() {
    this.timerSubscribe();
    let authValue = localStorage.getItem("authStatus") != null ? this.cryptoService.getDecryptedValue(localStorage.getItem("authStatus")?.trim()) : null;
    if (authValue === 'false')
      this.isPermissionAvailable = false;
    else
      this.isPermissionAvailable = true;
    this.isIdsEnabled = OidcConfig.isIdsEnabled;
    this.getFeatureList();
    this.getFeatureData();
  }
  getFeatureList() {
    if (!this.isIdsEnabled && localStorage.getItem("currentUser") != null &&
      localStorage.getItem("currentUser") != undefined) {
      let userData = JSON.parse(localStorage.getItem("currentUser") + "");
      this.userName = userData.firstName[0];
      this.userId = userData.encryptedUserId;
      this.isPermissionAvailable = true;
      this.isLoader = false;
    }
    else if (this.isIdsEnabled && this.ids.getToken() != null) {
      this.getUserPermissionByEmail()
    }
    else if (this.isIdsEnabled && localStorage.getItem("currentUser") != undefined) {
      this.isLoader = false;
      this.userName = localStorage.getItem("currentUser")[0];
      this.userId = "";//userData.encryptedUserId;//Need to be changed//Get encrypted user id from session or cookie
    }
  }
  getFeatureData() {
    if(this.featureList.length == 0){
      let  featureData = this.permissionService.getFeatureData();
      this.featureList = featureData != null && featureData!=undefined ? this.getFeatureJson(JSON.parse(featureData)) : [];
      this.resetParntActive('init')
    }
  }
  getFeatureJson(featureData:any) {
    if(featureData?.length > 0){
        featureData?.forEach(element => {
          if(element?.feature ==DataAnalyticsConstants.Dashboard){
            element.children = [];
          }
          else if(element?.feature ==DataAnalyticsConstants.Admin){
           element.children = element?.children.filter((child) => child.feature !== "ExcelPlugin");
          }
        });  
    return featureData;
    }
  }
  getUserPermissionByEmail(){
    let claims = this.ids.getClaimsFromToken();
    if (claims != null) {
      this.accountService.getUserPermissionByEmail()
        .subscribe({next:(result) => {
          if (result != null) {
            let permissions = JSON.stringify(result.permissions);
            let features = JSON.stringify(result.features);
            localStorage.setItem(`${this.ids.environment}_userPermissions`, permissions);
            localStorage.setItem(`${this.ids.environment}_featurePermissions`, features);
            this.featureList = result.features != null ? this.getFeatureJson(result?.features) : [];
            
            this.resetParntActive('init');
          }
          this.isPermissionAvailable = true;
          this.isLoader = false;
        },
          error:(error) => {
            this.accountService.redirectToUnauthorized();
            this.isLoader = false;
          }});

      this.userName = localStorage.getItem("currentUser")!=null ?  localStorage.getItem("currentUser")[0] : '';
      this.userId = "";//userData.encryptedUserId;//Need to be changed//Get encrypted user id from session or cookie
    }
  }
  getCurrentUser(){
    this.accountService.getCurrentUserDeatils().subscribe({next:
      (result) => {
        this.userEmail = result.emailID?.toLocaleLowerCase();
        //For test purpose
        if(!this.userEmail?.toLocaleLowerCase()?.includes('acuitykp.com')){
          this.isClientUser= true;
        } else{
          this.isClientUser= false;
        }
      },
      error:(error) => {
      }
  });
  }

  resubscribe(): void {
    this.idleTimer = true;
    this.timerSubscribe();
  }
  setContentWidth(event:string)
  {
    this.navbarString = event;
  }

  private timerSubscribe(): void {
    this._idleService
      .idleStateChanged()
      .subscribe(
        val => {
          if (val === IdleWarningStates.SecondaryTimerExpired) {
            this._idleService.stopTimer();
            this.idleTimer = false;
            this.router.navigate(['/out'], { queryParams: { action: 'logout' }, queryParamsHandling: 'merge' });
          }
        }
      );
  }

  resizeSideNav(size) {
    if(size == 'incress'){
      this.sidenavWidth =17.3;
      this.displayOpenOption = true
    }else{
      this.sidenavWidth = 4.68;
      this.displayOpenOption = false
    }
  }

  parentClickStatus(menu){
    let index = this.featureList.findIndex(x=> x.featureID == menu.featureID);
    this.featureList[index].isActiveParent = true
    localStorage.setItem(`${this.ids.environment}_isActiveParentID`, menu.featureID);
  }

  resetParntActive(val){
    let  self = this
    if(val == 'reset'){
      localStorage.setItem(`${this.ids.environment}_isActiveParentID`, '');
    }
      this.featureList?.forEach(function (val: any, key: any) {
        if (
          self.featureList[key].featureID ==
          parseInt(localStorage.getItem(`${self.ids.environment}_isActiveParentID`))
        ) {
          self.featureList[key].isActiveParent = true;
        } else {
          self.featureList[key].isActiveParent = false;
          self.featureList[key].isTabExpand = false;
        }
      });
  }



  activateSubMenu(data){
    let  self = this

    this.featureList.forEach(function (val: any, key: any) {
      if(val.featureID == data.featureID){
        self.featureList[key].isTabExpand = true
      }else{
        self.featureList[key].isTabExpand = false

      }
    })
  }
}
