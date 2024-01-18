import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ZeroStateKpiComponent } from './zero-state-kpi.component';

describe('ZeroStateKpiComponent', () => {
  let component: ZeroStateKpiComponent;
  let fixture: ComponentFixture<ZeroStateKpiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ZeroStateKpiComponent]
    });
    fixture = TestBed.createComponent(ZeroStateKpiComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`height has default value`, () => {
    expect(component.height).toEqual('66vh');
  });

  it(`message has default value`, () => {
    expect(component.message).toEqual('');
  });

  it(`header has default value`, () => {
    expect(component.header).toEqual('');
  });
});
