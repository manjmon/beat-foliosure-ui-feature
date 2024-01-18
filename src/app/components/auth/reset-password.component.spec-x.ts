import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { ResetPasswordComponent } from './reset-password.component';
import { FormsModule } from '@angular/forms';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const routerStub = () => ({});
    const accountServiceStub = () => ({});
    const alertServiceStub = () => ({});
    const miscellaneousServiceStub = () => ({});
    TestBed.configureTestingModule({
      imports : [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ResetPasswordComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: AlertService, useFactory: alertServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`isPasswordMatch has default value`, () => {
    expect(component.isPasswordMatch).toEqual(true);
  });

  it(`isCurrentPasswordValid has default value`, () => {
    expect(component.isCurrentPasswordValid).toEqual(true);
  });
});
