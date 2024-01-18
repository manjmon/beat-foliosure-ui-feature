import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { KpitablefiltersComponent } from './../components/kpitablefilters/kpitablefilters.component';
import { CommentControlComponent } from './../components/custom-controls/comment-control.component';
import { LocationControlComponent } from './../components/custom-controls/location-control.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TypeAheadControlComponent } from './../components/custom-controls/typeahead-control.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineBarChartComponent } from '../components/chart/lineBarChart';
import { DonutChartComponent } from '../components/chart/donutChart';
import { BarChartComponent } from '../components/chart/barChart';
import { MinusSignToBracketsPipe } from '../pipes/minus-sign-to-brackets';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Button } from 'projects/ng-neptune/src/lib/Button/button.component';
import { TooltipControlComponent } from '../components/custom-controls/tooltip-control.component';
import { MultilinePointChartComponent } from '../components/chart/multilinePointChart';
import { Table } from 'projects/ng-neptune/src/lib/Table/table.component';
import { TableModule } from 'primeng/table';
import { CheckboxComponentComponent } from 'projects/ng-neptune/src/lib/checkbox-component/checkbox.component';
import { ConfirmModalComponent } from 'projects/ng-neptune/src/lib/confirm-modal-component/confirm-modal.component';
import { SelectComponent } from 'projects/ng-neptune/src/lib/select/select.component';
import { TabComponent } from 'projects/ng-neptune/src/lib/Tab/tab.component';
import { InputComponent } from 'projects/ng-neptune/src/lib/Input/input.component';
import { ZeroStateKpiComponent } from '../components/kpi/zero-state-kpi.component';
import { FilterControlComponent } from '../components/custom-controls/filter-control.component';
import { PopUpLoaderComponent } from 'projects/ng-neptune/src/lib/pop-up-loader/pop-up-loader.component';
import {PdfviewerComponent} from 'projects/ng-neptune/src/lib/pdfviewer/pdfviewer.component';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { UnauthorizedaccesComponent } from '../components/unauthorizedacces/unauthorizedacces.component';
import { ModalComponent } from 'projects/ng-neptune/src/lib/modal-component/modal.component';
import { LoaderComponent } from 'projects/ng-neptune/src/lib/loader-component/loader-component.component';
import { PieChartComponent } from '../components/chart/PieChart';
import { CustomSelectComponent } from '../components/custom-controls/customselect.component';
import { PopoverComponentComponent } from 'projects/ng-neptune/src/lib/popover-component/popover.component';
import { BarChartReportComponent } from '../components/chart/barChartReport';
import { DonutChartReportComponent } from '../components/chart/donutChartReport';
import { LineBarChartReportComponent } from '../components/chart/lineBarChartReport';
import { SharedPipeModule } from './shared-pipe.module';
import { HorizontalNavBarComponent } from '../components/custom-controls/horizontal-navbar.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import {CustomSelectExtComponent} from '../components/custom-controls/extension/customselect-ext.component';
import { EmptyStateComponent } from 'projects/ng-neptune/src/lib/empty-state/empty-state.component';
import { QuarterYearControlComponent } from 'projects/ng-neptune/src/lib/quarter-year-control/quarter-year-control.component';
import { PaginatorControlComponent } from 'projects/ng-neptune/src/lib/paginator-control/paginator-control.component';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { MinusToBracketsWPercentagePipe } from '../pipes/minus-to-brackets-with-percentage';
import { CustomQuillEditorComponent } from '../components/custom-quill-editor/custom-quill-editor.component';
import { QuillModule } from 'ngx-quill';
@NgModule({
  declarations: [
    LineBarChartReportComponent,
    LineBarChartComponent,
    DonutChartComponent,
    PieChartComponent,
    BarChartComponent,
    BarChartReportComponent,
    DonutChartReportComponent,
    MinusSignToBracketsPipe,
    MinusToBracketsWPercentagePipe,
    TypeAheadControlComponent,
    QuarterYearControlComponent,
    PaginatorControlComponent,
    Button,
    TooltipControlComponent,
    LocationControlComponent,
    CommentControlComponent,
    MultilinePointChartComponent,
    Table,
    CheckboxComponentComponent,
    ConfirmModalComponent,
    ModalComponent,
    SelectComponent,
    TabComponent,
    InputComponent,
    ZeroStateKpiComponent,
    FilterControlComponent,
    PopUpLoaderComponent,
    PdfviewerComponent,
    UnauthorizedaccesComponent,
    LoaderComponent,
    KpitablefiltersComponent,
    CustomSelectComponent,
    PopoverComponentComponent,
    HorizontalNavBarComponent,
    CustomSelectExtComponent,
    EmptyStateComponent,
    CustomQuillEditorComponent
    
  ],
  imports: [AutoCompleteModule,PrimeNgModule, FormsModule, ReactiveFormsModule,CommonModule,OverlayPanelModule,TableModule,PdfJsViewerModule,DropdownModule,CalendarModule,SharedPipeModule,SelectButtonModule,
    QuillModule.forRoot()],
  exports: [
    LineBarChartReportComponent,
    LineBarChartComponent,
    DonutChartComponent,
    PieChartComponent,
    BarChartComponent,
    DonutChartReportComponent,
    BarChartReportComponent,
    MinusSignToBracketsPipe,
    MinusToBracketsWPercentagePipe,
    TypeAheadControlComponent,
    QuarterYearControlComponent,
    PaginatorControlComponent,
    Button,
    TooltipControlComponent,
    LocationControlComponent,
    CommentControlComponent,
    MultilinePointChartComponent,
    Table,
    CheckboxComponentComponent,
    ConfirmModalComponent,
    ModalComponent,
    SelectComponent,
    TabComponent,
    InputComponent,
    ZeroStateKpiComponent,
    FilterControlComponent,
    PopUpLoaderComponent,
    PdfviewerComponent,
    UnauthorizedaccesComponent,
    LoaderComponent,
    KpitablefiltersComponent,
    CustomSelectComponent,
    PopoverComponentComponent,
    HorizontalNavBarComponent,
    CustomSelectExtComponent,
    EmptyStateComponent,
    CustomQuillEditorComponent
  ]
})
export class SharedComponentModule { }
