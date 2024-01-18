import { Directive, ElementRef, Input } from '@angular/core';
import {  PermissionService } from '../services/permission.service';

@Directive({
  selector: '[hideIfUserUnAuthorized]'
})
export class CheckUserPermissionDirective {

  @Input("hideIfUserUnAuthorized") permission: any; 
  constructor(private el: ElementRef, private permissionService: PermissionService) { }
  ngOnInit() {
   if (!this.permissionService.checkUserPermission(this.permission.subFeatureId, this.permission.action,this.permission.id)) {
    if (this.el.nativeElement.className == "view-auth") {
      this.el.nativeElement.style.display = 'block'
    } else {
      this.el.nativeElement.style.cssText = 'display:none !important';
    }
      
  }
  }

}
