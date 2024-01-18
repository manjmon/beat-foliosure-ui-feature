import {  Component, OnInit, ViewChildren, ViewChild, QueryList, ElementRef, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Message } from "primeng/api/message";
import { AccountService } from "../../services/account.service";
import { FirmService } from "../../services/firm.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";

@Component({
  selector: "firm-details",
  templateUrl: "./firm-details.component.html",
  styleUrls: ["./firm-details.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class FirmDetailsComponent implements OnInit {
  msgs: Message[] = [];
  id: any;
  headquarterLocation: any;
  @ViewChildren("tblFundHolding") tblFundHolding: QueryList<ElementRef>;
  @ViewChild("tblfirmfunddetails") tblfirmfunddetails: ElementRef;
  geographicLocation: any = { isHeadquarter: false };
  model: any = {
    geographicLocations: [],
    firmEmployees: [],
  };
  loading = false;
  constructor(
    private accountService: AccountService,
    private miscService: MiscellaneousService,
    private firmService: FirmService,
    private _avRoute: ActivatedRoute
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
  }
  sourceURL: any;
  ngOnInit() {
    this.sourceURL = this.miscService.GetPriviousPageUrl();
    if (this.id != undefined) {
      this.loading = true;
      //get user details by user id
      this.firmService.getFirmById({ Value: this.id }).subscribe({
        next:(result) => {
          let resp = result["body"];

          if (resp != null && result.code == "OK") {
            this.model = resp;
            if(document.getElementById("HeaderNameID")){
              this.miscService.getTitle(this.model?.firmName);
            }
          } else {
            if (resp.code != null && resp.message != "") {
              this.msgs = this.miscService.showAlertMessages(
                "error",
                resp.status.message
              );
            }
          }

          this.loading = false;
          if (this.model.geographicLocations != null) {
            this.headquarterLocation = this.model.geographicLocations.filter(
              function (element: any, index: any) {
                return element.isHeadquarter;
              }
            )[0];
            this.model.geographicLocations = this.model.geographicLocations.filter(
              function (element: any, index: any) {
                return !element.isHeadquarter;
              }
            );
          }
        },
        error:(error) => {
          this.loading = false;
        }
    });
    }
  }
}
