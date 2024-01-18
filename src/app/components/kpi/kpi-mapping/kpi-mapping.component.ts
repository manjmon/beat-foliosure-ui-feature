import { Component, Input } from "@angular/core";
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";

@Component({
  selector: "app-kpi-mapping",
  templateUrl: "./kpi-mapping.component.html",
  styleUrls: ["./kpi-mapping.component.scss"],
})
export class KpiMappingComponent {
  selectedCopyToCompanyList:any=[];
  selectedCompany:any;
  portfolioCompanyList: any;
  @Input() kpiTypeSelected = null;
  @Input() kpiTypeList = null;
  @Input() kpiType: string;
  @Input() moduleID:number;
  @Input()reload:any;
  companyId: string;
  kpiMappingList = [];
  companyHeight = 430;
  isLoader:boolean = false;
  constructor(private portfolioCompanyService: PortfolioCompanyService) {
  }
  onSelectCompany(companyId: string) {
    this.companyId = companyId;
  }
  OnClear()
  {
    this.selectedCopyToCompanyList =[];
  }
}
