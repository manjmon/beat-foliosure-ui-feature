import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { environment } from "src/environments/environment";
import { DialogModule } from "primeng/dialog";
import { AuthGuard } from "../../guards/auth.guard";
import { LoginComponent } from "./login.component";
import { ResetPasswordComponent } from "./reset-password.component";
import { ResetPasswordControl } from "./reset-password.control";
import { RouterModule, Routes } from "@angular/router";
import { ComparePassword, PasswordValidator } from "src/app/directives/validate-password.directive";
export const routes: Routes = [

  { path: '', component: LoginComponent },

]
@NgModule({
  declarations: [LoginComponent, ResetPasswordComponent, ResetPasswordControl,PasswordValidator,ComparePassword,],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    RouterModule.forChild(routes)
  ],
  bootstrap: [],
  providers: [
    AuthGuard
  ],
})
export class LoginModule {}

export function getBaseUrl() {
  return environment.apiBaseUrl;
}
