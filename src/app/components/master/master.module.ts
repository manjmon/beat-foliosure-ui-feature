import { CommonModule } from "@angular/common";
import {SidebarModule} from 'primeng/sidebar';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  Injectable,
  Input,
  NgModule,
  ViewContainerRef,
} from "@angular/core";
import {
  RouterModule,
} from "@angular/router";
import { Observable, Subject, Subscription } from "rxjs";
import { HeaderComponent } from './header/header.component'
import { BreadcrumbComponent } from "./BreadcrumbComponent";
import { MatMenuModule } from '@angular/material/menu';
import { RippleModule } from "primeng/ripple";
import { NotificationService } from "src/app/services/Notification.service";
import { FileStatusService } from "src/app/services/file-status.service";
import { UploadService } from "src/app/services/upload.service";
import { NotificationSideNavComponent } from "./notification-side-nav/notification-side-nav.component";
import { TooltipModule } from "primeng/tooltip";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FileStatusSideNavComponent } from './file-status-side-nav/file-status-side-nav.component';
import { CommonUploadComponent } from "./common-upload/common-upload.component";
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { MiscellaneousService } from "src/app/services/miscellaneous.service";
import { DocumentService } from "src/app/services/document.service";
export interface ContentDescriptor {
  placeholder: string;
  elementRef: ElementRef;
}

@Injectable()
export class ContentService {
  private contentInit$ = new Subject<ContentDescriptor>();

  contentInit(): Observable<ContentDescriptor> {
    return this.contentInit$.asObservable();
  }

  registerContent(content: ContentDescriptor) {
    this.contentInit$.next(content);
  }
}

@Component({
  selector: "my-content",
  template: "<ng-content></ng-content>",
})
export class ContentComponent {
  @Input() placeholder: string;

  constructor(
    private elementRef: ElementRef,
    private contentService: ContentService
  ) {}

  ngOnInit() {
    this.contentService.registerContent({
      placeholder: this.placeholder,
      elementRef: this.elementRef,
    });
  }
}

@Component({
  selector: "my-placeholder",
  template: "<ng-content></ng-content>",
})
export class PlaceholderComponent {
  @Input() name: string;

  private subscription: Subscription;

  constructor(
    private containerRef: ViewContainerRef,
    private contentService: ContentService
  ) {
    this.subscription = contentService
      .contentInit()
      .subscribe((content: ContentDescriptor) => {
        if (content.placeholder == this.name) {
          this.containerRef.clear();
          this.containerRef.element.nativeElement.appendChild(
            content.elementRef.nativeElement
          );
        }
      });
  }

}

@NgModule({
  imports: [RouterModule,CommonModule,MatMenuModule,RippleModule,SidebarModule, BrowserAnimationsModule,TooltipModule,SharedComponentModule

  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [PlaceholderComponent, ContentComponent, BreadcrumbComponent,HeaderComponent,NotificationSideNavComponent, FileStatusSideNavComponent,CommonUploadComponent,  ],
  exports: [PlaceholderComponent, ContentComponent, BreadcrumbComponent,HeaderComponent,CommonUploadComponent],
  providers: [ContentService,NotificationService, FileStatusService, UploadService,MiscellaneousService,DocumentService],
})
export class MasterModule {}
