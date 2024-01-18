import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Table } from "./table.component";

describe("Table", () => {
  let component: Table;
  let fixture: ComponentFixture<Table>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [Table]
    });
    fixture = TestBed.createComponent(Table);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`tableheight has default value`, () => {
    expect(component.tableheight).toEqual(`30vw`);
  });

  it(`placeholder has default value`, () => {
    expect(component.placeholder).toEqual(`Search`);
  });

  it(`isDynamic has default value`, () => {
    expect(component.isDynamic).toEqual(false);
  });

  it(`scrollheight has default value`, () => {
    expect(component.scrollheight).toEqual(`30vw`);
  });

  it(`isCheckbox has default value`, () => {
    expect(component.isCheckbox).toEqual(true);
  });

  it(`headers has default value`, () => {
    expect(component.headers).toEqual([]);
  });

  it(`rowValues has default value`, () => {
    expect(component.rowValues).toEqual([]);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`checkAll has default value`, () => {
    expect(component.checkAll).toEqual(false);
  });

  it(`hasBorder has default value`, () => {
    expect(component.hasBorder).toEqual(false);
  });

  it(`ImagePath has default value`, () => {
    expect(component.ImagePath).toEqual(undefined);
  });

  it(`ImageSrc has default value`, () => {
    expect(component.ImageSrc).toEqual(undefined);
  });

  it(`iscommentsPopup has default value`, () => {
    expect(component.iscommentsPopup).toEqual(false);
  });
});
