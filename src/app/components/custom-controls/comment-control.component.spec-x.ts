import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommentControlComponent } from "./comment-control.component";

describe("CommentControlComponent", () => {
  let component: CommentControlComponent;
  let fixture: ComponentFixture<CommentControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CommentControlComponent]
    });
    fixture = TestBed.createComponent(CommentControlComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`placeholder has default value`, () => {
    expect(component.placeholder).toEqual(`Please Comment Here...`);
  });
});
