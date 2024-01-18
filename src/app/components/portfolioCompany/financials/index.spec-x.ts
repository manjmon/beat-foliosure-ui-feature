import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PortfolioCompanyFinancialsReportComponent } from './index';

describe('IndexComponent', () => {
    let component: PortfolioCompanyFinancialsReportComponent;
    let fixture: ComponentFixture<PortfolioCompanyFinancialsReportComponent>;

    beforeEach(waitForAsync(() => {
        try{
        TestBed.configureTestingModule({
            declarations: [PortfolioCompanyFinancialsReportComponent]
        })
            .compileComponents();
    }catch{}
    }));

    beforeEach(() => {
        try{
        fixture = TestBed.createComponent(PortfolioCompanyFinancialsReportComponent);
        }catch{}
    });
});