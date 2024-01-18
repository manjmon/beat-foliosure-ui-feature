import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageSettingsComponent } from './page-settings.component';
import { RouterModule } from '@angular/router';
import { PageConfigurationService } from 'src/app/services/page-configuration.service';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { MaterialModule } from '../../custom-modules/material.module';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageSettingsDeletePipe } from 'src/app/pipes/page-settings-delete-filter.pipe';
import { TagsValidator } from 'src/app/pipes/tags-validator';
import { CanDeactivateGuard } from 'src/app/unsaved-changes/can-deactivate/can-deactivate.guard';
import { ConfirmationService } from 'primeng/api';
import { MustMatchDirective } from 'src/app/pipes/MustMatch-directive';
import { PageConfigArrayFilterTrueOrFalse } from 'src/app/pipes/pagetrackrecord.pipe';
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedComponentModule,
    MaterialModule, PrimeNgModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: PageSettingsComponent, canDeactivate: [CanDeactivateGuard] }
    ])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [PageSettingsComponent, PageSettingsDeletePipe, TagsValidator, MustMatchDirective, PageConfigArrayFilterTrueOrFalse],
  // entryComponents: [
  //   ConfirmLeaveComponent
  // ],
  providers: [PageConfigurationService, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true,
  }, CanDeactivateGuard, ConfirmationService]
})
export class PageSettingsModule { }
