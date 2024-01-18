import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PaginatorControlComponent } from "./paginator-control.component";

describe("PaginatorControlComponent", () => {
  let component: PaginatorControlComponent;
  let fixture: ComponentFixture<PaginatorControlComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PaginatorControlComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub }
      ]
    });
    fixture = TestBed.createComponent(PaginatorControlComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`pageCount has default value`, () => {
    expect(component.pageCount).toEqual(5);
  });

  it(`rows has default value`, () => {
    expect(component.rows).toEqual(20);
  });

  it(`rowsPerPage has default value`, () => {
    expect(component.rowsPerPage).toEqual(20);
  });

  it(`first has default value`, () => {
    expect(component.first).toEqual(0);
  });

  it(`currentTablePageNo has default value`, () => {
    expect(component.currentTablePageNo).toEqual(1);
  });
});
