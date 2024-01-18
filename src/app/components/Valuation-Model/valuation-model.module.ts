import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { ValuationModelComponent } from './valuation-model/valuation-model.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { ValuationModelBulkUploadComponent } from './valuation-model-bulk-upload/valuation-model-bulk-upload.component';
import { ValuationModelService } from 'src/app/services/valuation-model.service'
import { TradingCompsComponent } from './valuation-model/trading-comps/trading-comps.component';
import { TransactionCompsComponent } from './valuation-model/transaction-comps/transaction-comps.component';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { MarketDataComponent } from './valuation-model/trading-comps/market-data/market-data.component';
import { FinancialDataComponent } from './valuation-model/trading-comps/financial-data/financial-data.component';
import { ValuationDataComponent } from './valuation-model/trading-comps/valuation-data/valuation-data.component';
import { TransactionFinancialDataComponent } from './valuation-model/transaction-comps/transaction-financial-data/transaction-financial-data.component';
import { TransactionDealDataComponent } from './valuation-model/transaction-comps/transaction-deal-data/transaction-deal-data.component';
import { TransactionValuationsDataComponent } from './valuation-model/transaction-comps/transaction-valuations-data/transaction-valuations-data.component';
import { TradingImpliedEvComponent } from './valuation-model/trading-comps/trading-implied-ev/trading-implied-ev.component';
import { AdjustmentDetailsComponent } from './valuation-model/implied-ev/adjustment-details/adjustment-details.component';
import { TransactionImpliedEvComponent } from './valuation-model/transaction-comps/transaction-implied-ev/transaction-implied-ev.component';
import { CanValuationDeactivateGuard } from 'src/app/unsaved-changes/can-deactivate/can-valuation-deactivate.guard';
import { ConfirmLeaveValuationComponent } from './valuation-model/confirm-leave-valuation/confirm-leave-valuation.component';
import { NgModule } from '@angular/core';
import { EquityValueComponent } from './valuation-model/implied-ev/equity-value/equity-value.component';

@NgModule({
  declarations: [
    ValuationModelComponent,
    ValuationModelBulkUploadComponent,
    TradingCompsComponent,
    TransactionCompsComponent,
    MarketDataComponent,
    FinancialDataComponent,
    ValuationDataComponent,
    TransactionFinancialDataComponent,
    TransactionDealDataComponent,
    TransactionValuationsDataComponent,
    TradingImpliedEvComponent,
    AdjustmentDetailsComponent,
    TransactionImpliedEvComponent,
    ConfirmLeaveValuationComponent,
    EquityValueComponent   

  ],
  imports: [
    FormsModule,
    CommonModule,
    PrimeNgModule,
    SharedComponentModule,
    RouterModule.forChild([
      { path: '', component: ValuationModelComponent, canDeactivate: [CanValuationDeactivateGuard] }
    ])
  ],
  // providers: [ValuationModelService]  
  providers: [ValuationModelService, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true,
  }, CanValuationDeactivateGuard]

  
})
export class ValuationModelModule { }
