import { Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { NumberDecimalConst } from 'src/app/common/constants';
import { InvestorService } from 'src/app/services/investor.service';
import { FeaturesEnum } from 'src/app/services/permission.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-investorlist',
  templateUrl: './investorlist.component.html',
  styleUrls: ['./investorlist.component.scss']
})
export class InvestorlistComponent{
  feature: typeof FeaturesEnum = FeaturesEnum;
  NumberDecimalConst = NumberDecimalConst;
  investorlist = [];
  globalFilter: string = "";
  paginationFilterClone: any = {};
  cols = [
    { field: 'investorName', header: 'InvestorName' },
    { field: 'investorType', header: 'InvestorType' },
    { field: 'totalCommitment', header: 'TotalCommitment' }
  ];
  constructor(private _investorService: InvestorService, private router: Router) { }

  getConfigurationDetails(event: any) {
    if (event == null) {
      event = { first: 0, rows: 10, globalFilter: null, sortField: null, sortOrder: 1 };
    }
    if (event.multiSortMeta == undefined) {
      event.multiSortMeta = [{ field: "investorName", order: 1 }];
      event.sortField = "investorName";
    }
    this._investorService.getinvestorlist({ paginationFilter: event }).subscribe((result: any) => {
      if (result != null) {
        this.investorlist = result;
      }
      else
      this.investorlist = [];
    });
  }
  loadFundsLazy(event: LazyLoadEvent) {
    this.getConfigurationDetails(event);
  }

  redirectToInvestor(investor){
    localStorage.setItem("headerName", investor.investorName);
    this.router.navigate(['/investor-details', investor.encryptedInvestorId]);
}
}
