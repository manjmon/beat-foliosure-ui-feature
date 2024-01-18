import { NgModule } from "@angular/core";
import { CheckboxModule } from 'primeng/checkbox';
import { TreeTableModule } from 'primeng/treetable';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenuModule } from 'primeng/menu';
import { MessagesModule } from 'primeng/messages';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule} from 'primeng/autocomplete';
import { CalendarModule} from 'primeng/calendar';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { DialogModule} from 'primeng/dialog';
import { MultiSelectModule} from 'primeng/multiselect';
import { PaginatorModule} from 'primeng/paginator';
import { SplitButtonModule} from 'primeng/splitbutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from "primeng/ripple";
import { TooltipModule } from "primeng/tooltip";
const primeng = [
  SelectButtonModule,
  TreeTableModule,
  InputSwitchModule,
  RadioButtonModule,
  CheckboxModule,
  ProgressBarModule,
  MenuModule,
  TableModule,
  PaginatorModule,
  ConfirmDialogModule,
  AccordionModule,
  MessagesModule,
  CalendarModule,
  AutoCompleteModule,
  MultiSelectModule,
  PanelModule,
  OverlayPanelModule,
  ToastModule,
  DialogModule,
  FileUploadModule,
  ProgressBarModule,
  SplitButtonModule,
  RippleModule,
  TooltipModule
];
@NgModule({
    imports: [primeng],
    exports: [primeng]
  })
  
  export class PrimeNgModule { }