

import { LoginComponent } from "./login.component";
import { Routes, RouterModule } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'

export const routes: Routes = [

  { path: 'login', component: LoginComponent },

]
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes)
