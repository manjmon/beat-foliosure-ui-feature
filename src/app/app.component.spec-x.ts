import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './services/data-service.service';
import { AppSettingService } from './services/appsettings.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    const routerStub = () => ({
      navigate: array => ({}),
      events: { subscribe: f => f({}) },
      config: {}
    });
    const dataServiceStub = () => ({
      currentApprovalStageMessage: { subscribe: f => f({}) }
    });
    const appSettingServiceStub = () => ({
      setGetConfig: () => ({ then: () => ({}) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AppComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: DataService, useFactory: dataServiceStub },
        { provide: AppSettingService, useFactory: appSettingServiceStub }
      ]
    });
    spyOn(AppComponent.prototype, 'filterValueFunction');
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`title has default value`, () => {
    expect(component.title).toEqual(`beat-foliosure-ui`);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  describe('constructor', () => {
    it('makes expected calls', () => {
      expect(AppComponent.prototype.filterValueFunction).toHaveBeenCalled();
    });
  });
});
