import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UnauthorizedaccesComponent } from "./unauthorizedacces.component";
export const routes: Routes = [

  { path: '', component: UnauthorizedaccesComponent },

]
@NgModule({
  declarations: [UnauthorizedaccesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  bootstrap: []
})
export class UnAuthorizedModule {}