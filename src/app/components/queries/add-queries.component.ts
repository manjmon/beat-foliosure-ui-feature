﻿import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbDateParserFormatter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import "codemirror";
import { Message } from "primeng/api/message";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { NgbDateParserFormatter_uk } from "../../shared/NgbDateParserFormatter_uk";

@Component({
  selector: "create-update-queries",
  templateUrl: "./add-queries.component.html",
  styleUrls: ['./add-queries.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateParserFormatter_uk },
  ],
})
export class AddQueryComponent implements OnInit {
  model: any = {};
  title: string = "Create";
  resetText: string = "Reset";
  loadQuery: any = "";
  id: string;
  masterModel: any = {};
  geographyModel: any;
  msgTimeSpan: number;
  loading: boolean;
  datemodel: NgbDateStruct;
  msgs: Message[] = [];
  masterDataLoadRequired: boolean = true;
  loadPreview: boolean = false;
  loadSave: boolean = false;
  loadExport: boolean = false;
  loadClean: boolean = false;
  reportData: any = [];
  SqlMessageClass: string = "";
  sqlException: string = "";
  showSqlError: boolean = true;
  @ViewChild("query") myEditor: any = {};
  editor: any = {};
  constructor(
    private _avRoute: ActivatedRoute,
    private miscService: MiscellaneousService,
    private _router: Router,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
      this.loadPreview = false;
      this.loadClean = false;
      this.loadSave = true;
      this.loadExport = true;
      this.title = "Update";
      this.resetText = "Reload";
      this.loading = true;
    }
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
  }
  sourceURL: any;
  ngOnInit() {
    this.sourceURL = this.miscService.GetPriviousPageUrl();
    this.setDefaultValues();
  }

  setDefaultValues() {
    if (this.id != undefined) {
      this.loading = true;
      this.loadSave = false;
      this.title = "Update";

      this.miscService
        .getQueryById({ EncryptedQueryId: this.id, PaginationFilter: null })
        .subscribe(
          (result) => {
            let resp = result["body"];
            if (resp.queryList.length == 1) {
              if (resp.queryList[0] == null) {
                this.msgs = this.miscService.showAlertMessages(
                  "error",
                  resp[0].response
                );
              } else {
                this.model = resp.queryList[0];
                this.loadQuery = resp.queryList[0].query;

                const mime = "text/x-mssql";
                const currentWindow = this.miscService.nativeWindow;
                let editor = this.myEditor.nativeElement;
                if (this.masterDataLoadRequired) {
                  setTimeout(function () {
                    currentWindow.editor = this.myEditor.CodeMirror.fromTextArea(editor, {
                      mode: mime,
                      indentWithTabs: true,
                      smartIndent: true,
                      lineNumbers: false,
                      autofocus: true,
                      extraKeys: { "Ctrl-Space": "autocomplete" },
                    });
                  }, 0);
                } else {
                  setTimeout(function () {
                    currentWindow.editor.setValue(resp.queryList[0].query);
                  });
                }
                this.loadClean = false;
              }
            } else {
              this.model = resp;
            }

            this.loading = false;
          },
          (error) => {
            this.miscService.redirectToLogin(error);
            this.loading = false;
          }
        );
    }
  }

  saveQuery(f: any) {
    this.loading = true;
    const currentWindow = this.miscService.nativeWindow;
    let currentQuery = currentWindow.editor.getValue();
    this.model.query = currentQuery;
    currentQuery = currentQuery.trim();
    let value = this.doValidationForSqlQuery(currentQuery);
    if (value) {
      this.miscService.AddUpdateQuery(this.model).subscribe(
        (data) => {
          if (this.id == undefined) {
            this.loadSave = true;
          } else {
            this.loadSave = false;
          }
          this.loadExport = true;
          if (data.message.includes("Sql Exception:")) {
            this.msgs = this.miscService.showAlertMessages(
              "error",
              data.message
            );
          } else {
            if (this.title == "Create") {
              if (data.code == "OK") {
                this.msgs = this.miscService.showAlertMessages(
                  "success",
                  "Query added successfully"
                );
                this.formReset(f);
              } else {
                this.msgs = this.miscService.showAlertMessages(
                  "error",
                  data.message
                );
              }
            } else {
              if (data.code == "OK") {
                this.msgs = this.miscService.showAlertMessages(
                  "success",
                  data.message
                );
                this.formReset(f);
              } else {
                this.msgs = this.miscService.showAlertMessages(
                  "error",
                  data.message
                );
              }
            }
          }
          this.loading = false;
        },
        (error) => {
          this.msgs = this.miscService.showAlertMessages("error", error);
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
    }
  }

  queryPreview(event: any) {
    this.loading = true;
    const currentWindow = this.miscService.nativeWindow;
    let currentQuery = currentWindow.editor.getValue();
    this.model.query = currentQuery;
    currentQuery = currentQuery.trim();
    let value = this.doValidationForSqlQuery(currentQuery);

    if (value) {
      this.miscService
        .getDynamicQueriesPreview({ Query: currentQuery })
        .subscribe(
          (result) => {
            if (result["body"] == null) {
              this.SqlMessageClass = "text-danger";
              this.sqlException = "Sql Exception: " + result["message"];
              this.loading = false;
            } else {
              this.reportData = result["body"];
              let local = this;
              try {
                if (local.reportData.length > 0) {
                  if (local.reportData[0].Columns.length > 0) {
                    local.reportData.forEach(function (val: any, i: any) {
                      val.cols = [];
                      val.Columns.forEach(function (value: any, i: any) {
                        val.cols.push({ field: value, header: value });
                      });
                    });
                  }
                }

                this.loadSave = false;
                if (this.reportData[0].Results.length > 0) {
                  this.loadExport = false;
                }                
                this.loading = false;
              } catch (e) {
                let count = (currentQuery.match(/select/g) || []).length;
                this.SqlMessageClass = "text-danger";
                if (count > 1) {
                  this.sqlException =
                    local.reportData +
                    " check editor should not have multiple queries.";
                } else {
                  this.sqlException = local.reportData;
                }

                local.reportData = null;
                this.loading = false;
              }
            }
          },
          (error) => {
            this.SqlMessageClass = "text-danger";
            this.sqlException =
              "Error :- occur due to wrong query or server side error occur.";
            this.loading = false;
          }
        );
    } else {
      this.loading = false;
    }
  }

  queryExport(f: any) {
    this.loading = true;
    const currentWindow = this.miscService.nativeWindow;
    let currentQuery = currentWindow.editor.getValue();
    currentQuery = currentQuery.trim();
    this.doValidationForSqlQuery(currentQuery);

    this.miscService.exportEditorQueryList({ Value: currentQuery }).subscribe(
      (response) => {
        if (response.ok) {
          this.miscService.downloadExcelFile(response);
        } else {
          this.msgs = this.miscService.showAlertMessages(
            "error",
            "File is not downloaded."
          );
        }
        this.loading = false;
      },
      (error) => {
        this.msgs = this.miscService.showAlertMessages(
          "error",
          "Something went wrong. Please check the query and try again."
        );
        this.loading = false;
      }
    );
    this.loadSave = false;
    this.loadExport = false;
  }

  formReset(f: any) {
    this.editorClean(f);
    f.resetForm();
    this.changeDetectorRef.detectChanges();
    this.masterDataLoadRequired = false;
    this.setDefaultValues();
  }

  editorClean(f: any) {
    this.SqlMessageClass = "";
    this.sqlException = "";
    this.model.query = "";
    this.reportData = null;
    if (this.id == undefined) {
      this.loadSave = true;
    } else {
      this.loadSave = false;
    }
    this.loadExport = true;
    const currentWindow = this.miscService.nativeWindow;
    setTimeout(function () {
      currentWindow.editor.setValue("");
    });
  }

  ngAfterViewInit() {
    if (this.id == undefined) {
      const mime = "text/x-mssql";
      const currentWindow = this.miscService.nativeWindow;
      currentWindow.editor = this.myEditor.CodeMirror.fromTextArea(
        this.myEditor.nativeElement,
        {
          mode: mime,
          indentWithTabs: true,
          smartIndent: true,
          lineNumbers: false,
          autofocus: true,
          extraKeys: { "Ctrl-Space": "autocomplete" },
        }
      );
    }
  }

  doValidationForSqlQuery(currentQuery: string) {
    this.reportData = null;
    if (this.id == undefined) {
      this.loadSave = true;
    } else {
      this.loadSave = false;
    }
    this.loadExport = true;
    if (currentQuery == "") {
      this.SqlMessageClass = "text-danger";
      this.sqlException =
        "Error :- Query editor is empty, please enter a query.";
      const currentWindow = this.miscService.nativeWindow;
      setTimeout(function () {
        currentWindow.editor.setValue("");
      });

      return false;
    } else if (
      !currentQuery
        .trim()
        .substring(0, 6)
        .trim()
        .toLowerCase()
        .includes("select")
    ) {
      this.SqlMessageClass = "text-danger";
      this.sqlException =
        "Error :- Only select query can be executed, please enter a select query.";

      return false;
    } else if (
      (currentQuery.trim().toLowerCase().includes("delete") &&
        !currentQuery.trim().toLowerCase().includes("'delete'") &&
        !currentQuery.trim().toLowerCase().includes("isdeleted")) ||
      (currentQuery.trim().toLowerCase().includes("truncate") &&
        !currentQuery.trim().toLowerCase().includes("'truncate'")) ||
      (currentQuery.trim().toLowerCase().includes("drop") &&
        !currentQuery.trim().toLowerCase().includes("'drop'")) ||
      (currentQuery.trim().toLowerCase().includes("alter") &&
        !currentQuery.trim().toLowerCase().includes("'alter'"))
    ) {
      this.SqlMessageClass = "text-danger";
      this.sqlException =
        "Error :- Query contain some invalid keywords, please check the query.";

      return false;
    } else {
      this.SqlMessageClass = "text-danger";
      this.sqlException = "";

      return true;
    }
  }

  previewEnableDisable() {
    const currentWindow = this.miscService.nativeWindow;
    if (currentWindow.editor) {
      if (currentWindow.editor.getValue().trim() == "") {
        this.loadPreview = true;
        this.loadClean = true;
        if (this.id == undefined) {
          this.loadSave = true;
        } else {
          this.loadSave = false;
        }
        this.loadExport = true;
      } else {
        this.loadPreview = false;
        this.loadClean = false;
      }
    }
    return this.loadPreview;
  }
}
