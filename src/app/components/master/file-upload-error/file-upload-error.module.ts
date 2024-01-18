import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { MaterialModule } from 'src/app/custom-modules/material.module';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { RouterModule } from '@angular/router';
import { FileUploadErrorComponent } from './file-upload-error.component';
import { FormsModule } from '@angular/forms';
import { TruncateFilePipe } from 'src/app/pipes/truncate-file.pipe';

@NgModule({
  declarations: [
    FileUploadErrorComponent,TruncateFilePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgModule,
    SharedComponentModule,
    MaterialModule,
        RouterModule.forChild([
      { path: '', component: FileUploadErrorComponent }
    ])
  ],
  providers: [ ],
})
export class FileUploadErrorModule { 

 
	

}
