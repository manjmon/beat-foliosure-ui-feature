import {Component} from "@angular/core";
export interface IComponentCanDeactivate {
  canDeactivate(): boolean;
  unloadNotification($event: any);
}
@Component({
    template: ''
  })
export abstract class ComponentCanDeactivate implements IComponentCanDeactivate {
 
  abstract  canDeactivate(): boolean;
   // @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (!this.canDeactivate()) {
            $event.returnValue =true;
        }
        
    }
}


export abstract class ValuationComponentCanDeactivate implements IComponentCanDeactivate {
  abstract  canDeactivate(): boolean;
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
        $event.returnValue =true;
    }
  }
    
}
