import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from "src/environments/environment";
import { NgbActiveModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerModule } from "ngx-spinner";
import { CheckboxModule } from "primeng/checkbox";
import { TreeTableModule } from "primeng/treetable";
import { InputSwitchModule } from "primeng/inputswitch";
import { MenuModule } from "primeng/menu";
import { MessagesModule } from "primeng/messages";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { AuthGuard } from "./../../guards/auth.guard";
import { routing } from "./auth.routing";
import { AccountService } from "./../../services/account.service";
import { MiscellaneousService } from "./../../services/miscellaneous.service";
import { PermissionService } from "./../../services/permission.service";
import { LoginComponent } from "./login.component";
import { ResetPasswordComponent } from "./reset-password.component";
import { ResetPasswordControl } from "./reset-password.control";

@NgModule({
  declarations: [LoginComponent, ResetPasswordComponent, ResetPasswordControl],

  imports: [
    CommonModule,
    routing,
    BrowserAnimationsModule,
    TreeTableModule,
    InputSwitchModule,
    CheckboxModule,
    MenuModule,
    
    NgxSpinnerModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    MessagesModule,
    MessagesModule,
    NgbModule,
    CalendarModule,
    OverlayPanelModule,
    HttpClientModule,
    DialogModule,
  ],
  bootstrap: [],
  providers: [
    PermissionService,
    AccountService,
    AuthGuard,
    MiscellaneousService,
    NgbActiveModal,
  ],
})
export class AuthenticationModule {}

export function getBaseUrl() {
  return environment.apiBaseUrl;
}
