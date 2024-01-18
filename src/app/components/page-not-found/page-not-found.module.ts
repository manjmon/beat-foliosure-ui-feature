import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageNotFoundComponent } from "./page-not-found.component";

export const routes: Routes = [

  { path: '', component: PageNotFoundComponent },

]
@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  bootstrap: []
})
export class PageNotFoundModule {}