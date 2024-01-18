import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { PermissionService } from "../../services/permission.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-breadcrumb",
  templateUrl: "breadcrumb.component.html",
})
export class BreadcrumbComponent {
  @Input() name: string;
  @ViewChild("navBreadcrumb") navBreadcrumb: ElementRef;

  private subscription: Subscription;

  links: any[] = [];
  currentItem: any = null;
  EnableBack: boolean = false;
  customHeader: string;
  customHeaderEnable: boolean = false;

  constructor(
    private router: Router,
    private location: Location,
    private permissionService: PermissionService
  ) {
    this.subscription = router.events.subscribe((event: any) => {
      if (event.url === "/audit-logs" || event.url === "/fileuploadstatus") {
        this.EnableBack = true;
      }
      if (event instanceof NavigationStart) {
        let prevUrl: any =
          localStorage.getItem("currentURL") != null
            ? localStorage.getItem("currentURL")
            : "";
        if (prevUrl != null && prevUrl != "") {
          localStorage.setItem("previousURL", prevUrl);
        }
      }

      if (event instanceof NavigationEnd) {
        let local = this;

        localStorage.setItem("currentURL", event.url);
        let navItem = this.permissionService.navigationItems.filter(function (
          ele: any,
          i: any
        ) {
          return ele.url == event.url;
        });
        if (navItem.length <= 0) {
          navItem = this.permissionService.navigationItems.filter(function (
            ele: any,
            i: any
          ) {
            let segments = event.url.split("/");
            segments.pop();
            segments.splice(0, 1);
            return ele.url == "/" + segments.join("/") + "/:id";
          });
        }
        if (navItem.length > 0) {
          let parentItems = local.getAllNavItemsInHierarchy(navItem[0].parent);
          if (parentItems.length > 0) {
            this.EnableBack = true;
            if (
              localStorage.getItem("currentURL") ==
              localStorage.getItem("previousURL")
            ) {
              localStorage.setItem("previousURL", parentItems[0].url);
            }
            local.links = parentItems;
          }
          this.currentItem = navItem[0];
          setTimeout(() => {
            if(this.currentItem.label == 'Fund Details' || this.currentItem.label ==  'Data Analytics'|| this.currentItem.label == 'Portfolio Company Details' || this.currentItem.label == 'Cashflow Details' || this.currentItem.label == 'Firm Details' || this.currentItem.label == 'Firm Details'||
            this.currentItem.label == 'Deal Details' || this.currentItem.label == 'Pipeline Details' || this.currentItem.label == 'KPI List' || this.currentItem.label == 'Pipeline' || this.currentItem.label == 'Investor Details' || this.currentItem.label == "Financial/Operational KPIs"){ 
              this.customHeaderEnable = true;
              this.customHeader = localStorage.getItem("headerName")!="undefined"?localStorage.getItem("headerName"):null;   
            }
          }, 100);
          if(this.currentItem.label == 'Update Firm' || this.currentItem.label == 'Update Fund' || this.currentItem.label == 'Update Deal' || this.currentItem.label == 'Update Pipeline' || this.currentItem.label == 'Update Portfolio Company' || this.currentItem.label == 'Update Investor'){
            this.customHeaderEnable = true;
            this.customHeader = localStorage.getItem("headerName")!="undefined"? 'Update ' + localStorage.getItem("headerName"):null;
          }
          if(this.currentItem.label=="Report Download")
          {
            this.customHeaderEnable = true;
            this.customHeader = "Download";
          }
          
          if(navItem.length > 0 && parseInt(navItem[0].id) ==1000) {
            this.currentItem.label = (sessionStorage.getItem("companyName") !== 'undefined' && JSON.parse(sessionStorage.getItem("companyName"))) || '';
          }
          if(this.currentItem.label=="Bulk Upload Error")
          {
            this.customHeaderEnable = true;
            this.customHeader = "Bulk Upload";
          }
        }
      }
    });
  }
  getAllNavItemsInHierarchy(id: any) {
    let items: any[] = [];
    if (id != "") {
      let item = this.permissionService.navigationItems.filter(function (
        ele: any,
        i: any
      ) {
        return ele.id == id;
      });
      if (item.length > 0) {
        if (item[0].parent != "") {
          items = items.concat(this.getAllNavItemsInHierarchy(item[0].parent));
        }
        items.push(item[0]);
      }
    }
    return items;
  }
  GoBack() {
    this.location.back();
  }
}
