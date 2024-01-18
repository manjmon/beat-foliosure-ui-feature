﻿import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { AccountService } from "src/app/services/account.service";
import { FilterService } from "src/app/services/filter.services";

@Component({
  selector: "filter-control",
  templateUrl: "./filter-control.component.html",
})
export class FilterControlComponent implements OnInit, OnChanges {
  _filterServices: FilterService;
  _accountServices: AccountService;
  @Output() onReset = new EventEmitter<any>();
  @Output() onApply = new EventEmitter<any>();
  @Output() OnSavedFilter = new EventEmitter<any>();
  @Input() IsEnabled: boolean = false;
  @Input() ReportId: number = -1;
  @Input() Filters: any = null;
  EditMode: boolean = false;
  disablePrimaryButton: boolean = true;
  optionsList: any[];
  confirmSave: boolean = false;
  confirmDelete: boolean = false;
  userReportName: string = "";
  selectReport: any = {};
  DeleteDisabled: boolean = true;
  IsItemSelected: boolean = false;
  ShowFilterUpdated: boolean = false;
  DuplicateRecord: boolean = false;
  EditDuplicateRecord: boolean = false;
  SelectedReport: any = {};
  NewlyAddedId: number = 0;
  constructor(filterService: FilterService, accountService: AccountService) {
    this._filterServices = filterService;
    this._accountServices = accountService;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ReportId !== undefined) {
      if (changes.ReportId.currentValue !== changes.ReportId.previousValue) {
        this.ResetFilters();
      }
    }
  }
  ngOnInit(): void {
    this.LoadFilters();
  }

  OnFilterNamedChanged(event) {
    this.disablePrimaryButton = event.target.value.trim().length <= 0;
    this.userReportName = event.target.value;
    this.DuplicateRecord = false;
  }
  ApplyFilters() {
    this.onApply.emit();
  }
  ResetFilters() {
    this.selectReport = null;
    this.EditDuplicateRecord = false;
    this.IsItemSelected = false;
    this.LoadFilters();
    this.onReset.emit();
  }
  SaveFilters() {
    this.userReportName = "";
    this.confirmSave = true;
    this.disablePrimaryButton = true;
  }
  onCancel() {
    this.confirmSave = false;
    this.DuplicateRecord = false;
    this.EditDuplicateRecord = false;
  }
  OnDeleteFilter() {
    this.confirmDelete = true;
  }
  CancelDelete() {
    this.confirmDelete = false;
  }
  search() {
    this.LoadFilters();
  }
  onSave() {
    delete this.Filters.userReportId;
    delete this.Filters.userReportName;
    this.Filters.userReportName = this.userReportName.trim();
    this.Filters.ReportId = this.ReportId;
    this._filterServices.SaveFilter(this.Filters).subscribe({
      next:(response) => {
        if (response > 0) {
          this.confirmSave = false;
          this.NewlyAddedId = response;
          this.IsItemSelected = false;
          this.LoadFilters();
        }
        if (response === -1) {
          this.DuplicateRecord = true;
        }
      },
      error:(error) => this._accountServices.redirectToLogin(error)
  });
  }
  Delete() {
    this.confirmDelete = false;
    this._filterServices.DeleteFilter(this.selectReport.userReportId).subscribe({
      next: (response) => {
        this.LoadFilters();
        this.onReset.emit();
        this.IsItemSelected = false;
      },
      error: (error) => this._accountServices.redirectToLogin(error)
    });
    this.selectReport = null;
  }
  Update() {
    let local = this;
    let temp = this.selectReport.userReportName;
    if (temp === undefined) {
      temp = this.selectReport;
      this._filterServices
        .getFilter(this.SelectedReport.userReportId)
        .subscribe({
          next:(response) => {
            delete response.UserReportName;
            response.UserReportName = temp;
            response.userReportId = this.SelectedReport.userReportId;

            this._filterServices.UpdateFilter(response).subscribe({
              next:(response) => {
                this.IsItemSelected = false;
                if (response === -1) {
                  this.EditDuplicateRecord = true;
                } else {
                  this.ShowFilterUpdated = true;
                  local.IsEnabled = false;
                  this.EditDuplicateRecord = false;
                  setTimeout(() => {
                    local.ShowFilterUpdated = false;
                  }, 2000);
                }
              },
              error:(error) => this._accountServices.redirectToLogin(error)
          });
          },
          error:(error) => this._accountServices.redirectToLogin(error)
    });
    } else {
      this.Filters.userReportId = this.SelectedReport.userReportId;
      this.Filters.UserReportName = temp;
      this._filterServices.UpdateFilter(this.Filters).subscribe({
        next: (response) => {
          this.ShowFilterUpdated = true;
          local.IsEnabled = false;
          this.optionsList = response;
          this.IsItemSelected = false;
          setTimeout(() => {
            this.ShowFilterUpdated = false;
          }, 2000);
        },
        error: (error) => this._accountServices.redirectToLogin(error)
      });
    }
  }
  OnFiltersSelected() {
    this.DeleteDisabled = false;
    this.SelectedReport = this.selectReport;
    this._filterServices.getFilter(this.selectReport.userReportId).subscribe({
      next: (response) => {
        this.OnSavedFilter.emit(response);
      },
      error: (error) => this._accountServices.redirectToLogin(error)
    });
  }
  LoadFilters() {
    let local = this;
    this._filterServices.getFilters().subscribe({
      next: (response: any) => {
        let SavedFilters = response.filter((s: any) => s.reportID == this.ReportId);
        if (SavedFilters !== undefined) {
          if (SavedFilters.length > 0) {
            this.EditMode = true;
            local.optionsList = SavedFilters;
            this.DeleteDisabled = true;
            if (local.NewlyAddedId > 0) {
              local.selectReport = SavedFilters.find(
                (s: any) => s.userReportId == local.NewlyAddedId
              );
              local.NewlyAddedId = 0;
              this.DeleteDisabled = false;
              this.IsEnabled = false;
            }
          } else {
            this.EditMode = false;
          }
        }
      },
      error: (error: any) => this._accountServices.redirectToLogin(error)
    });
  }
}
