
import { NotificationService } from './services/Notification.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import 'codemirror';
import { NgxSpinnerModule } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PortfolioCompanyDataExtractionComponent } from './components/dataExtraction/portfolioCompany-DataExtraction.component';
import { FieldErrorDisplayComponent } from './components/field-error-display/field-error-display.component';
import { MasterComponent } from './components/master/master.component';
import { MasterModule } from './components/master/master.module';
import { BlockCutCopyPasteDirective } from './directives/block-cutcopypaste.directive';
import { CustomRequiredValidator } from './directives/required.directive';
import { CustomBusinessNameValidator } from './directives/validate-businessname';
import { CustomEmailValidator } from './directives/validate-email.directive';
import {
    GreaterValidator,
    SmallerValidator,
} from './directives/validate-range.directive';
import { InputValidatorDirective } from './directives/validate-special-characters.directive';
import { CustomURLValidator } from './directives/validate-url.directive';
import { AuthGuard } from './guards/auth.guard';
import { HttpServiceInterceptor } from './interceptors/http-service-interceptor';
import { EnumKeyValueListPipe } from './pipes/enumlist.pipe';
import { SumPipe } from './pipes/sum.pipe';
import { AccountService } from './services/account.service';
import { AlertService } from './services/alert.service';
import { CashflowService } from './services/cashflow.service';
import { DealService } from './services/deal.service';
import { FileUploadService } from './services/file-upload.service';
import { FirmService } from './services/firm.service';
import { FundService } from './services/funds.service';
import { MiscellaneousService } from './services/miscellaneous.service';
import { PermissionService } from './services/permission.service';
import { PipelineService } from './services/pipeline.service';
import { PortfolioCompanyService } from './services/portfolioCompany.service';
import { ReportService } from './services/report.service';
import { UploadService } from './services/upload.service';
import { DocumentService } from './services/document.service';
import { AppSettingService } from './services/appsettings.service';
import { ToastrModule } from 'ngx-toastr';
import { Alert } from './../../projects/ng-neptune/src/lib/Alert/alter.component';
import { Toast } from '../../projects/ng-neptune/src/lib/Toast/toast.component';
import { FilterService } from './services/filter.services';
import { AuditService } from './services/audit.service';
import { ViewPCAduitlogsComponent } from './components/portfolioCompany/view-pc-aduitlogs/view-pc-aduitlogs.component';
import { MultiSelectComponent } from '../../projects/ng-neptune/src/lib/multi-select/multi-select.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MaterialModule } from './custom-modules/material.module';
import { PrimeNgModule } from './custom-modules/prime-ng.module';
import { CryptoService } from './services/crypto.service';
import { OidcAuthService } from './services/oidc-auth.service';
import { MessageService } from 'primeng/api';
import { SharedDirectiveModule } from './directives/shared-directive.module';
import { SharedComponentModule } from './custom-modules/shared-component.module';
import { SharedPageModule } from './custom-modules/shared-page.module';
import { SharedPipeModule } from './custom-modules/shared-pipe.module';
import { DataService } from './services/data-service.service';
import { TwoDigitDecimaNumberDirective } from './directives/decimal-number.directive';
import { AngularResizeEventModule } from 'angular-resize-event';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { QuillModule } from 'ngx-quill';
import { PortfolioCompanyDraftService } from './services/portfolio-company-draft.service';
import quill from "../../node_modules/quill";
import { ImpliedEvService } from './services/implied-ev.service';
import { EsgService } from "./services/esg.services";


let Size = quill.import("attributors/style/size");

Size.whitelist = [
    "9px",
    "10px",
    "11px",
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "22px",
    "24px",
    "26px",
    "28px",
];
quill.register(Size, true);
@NgModule({
    declarations: [
        AppComponent,
        MasterComponent,
        CustomEmailValidator,
        CustomRequiredValidator,
        CustomURLValidator,
        FieldErrorDisplayComponent,
        InputValidatorDirective,
        CustomBusinessNameValidator,
        EnumKeyValueListPipe,
        SumPipe,
        BlockCutCopyPasteDirective,
        SmallerValidator,
        GreaterValidator,
        PortfolioCompanyDataExtractionComponent,
        Alert,
        Toast,
        MultiSelectComponent,
        ViewPCAduitlogsComponent,
        TwoDigitDecimaNumberDirective,
        
    ],
    imports: [
        SharedPipeModule,
        SharedPageModule,
        SharedComponentModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        NgxSpinnerModule,
        MasterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        NgbModule,
        HttpClientModule,
        ToastrModule.forRoot({
            positionClass: 'inline',
            timeOut: 5000,
            preventDuplicates: true,
            closeButton: true,
        }),
        // ToastContainerModule,
        // PdfJsViewerModule,
        AutocompleteLibModule,
        AngularEditorModule,
        MaterialModule,
        PrimeNgModule,
        //NgxIdleTimeoutModule,
        SharedDirectiveModule,
        AngularResizeEventModule,
        ScrollingModule,
        QuillModule.forRoot(),

    ],
    providers: [
        CashflowService,
        FileUploadService,
        PipelineService,
        PermissionService,
        FundService,
        AccountService,
        FirmService,
        PortfolioCompanyService,
        AlertService,
        AuthGuard,
        MiscellaneousService,
        NgbActiveModal,
        DealService,
        AuditService,
        ReportService,
        UploadService,
        CryptoService,
        DocumentService,
        FilterService,
        OidcAuthService,
        PortfolioCompanyDraftService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpServiceInterceptor,
            multi: true,
        },
        NotificationService,
        MessageService,
        DataService,
        AppSettingService,
        ImpliedEvService,
        EsgService
    ],
    bootstrap: [AppComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class AppModule { }
export function getBaseUrl() {
    return environment.apiBaseUrl;
}