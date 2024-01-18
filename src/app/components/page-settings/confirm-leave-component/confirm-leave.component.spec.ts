import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfirmLeaveComponent } from "./confirm-leave.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

describe("ConfirmLeaveComponent", () => {
  let component: ConfirmLeaveComponent;
  let fixture: ComponentFixture<ConfirmLeaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmLeaveComponent],
      providers: [NgbActiveModal]
    });
    fixture = TestBed.createComponent(ConfirmLeaveComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit true when CloseModal is called with 'Yes'", () => {
    spyOn(component.onSave, "emit");
    spyOn(component.activeModal, "close");
    component.CloseModal("Yes");
    expect(component.onSave.emit).toHaveBeenCalledWith(true);
    expect(component.activeModal.close).toHaveBeenCalled();
  });

  it("should emit false when CloseModal is called with any value other than 'Yes'", () => {
    spyOn(component.onSave, "emit");
    spyOn(component.activeModal, "close");
    component.CloseModal("No");
    expect(component.onSave.emit).toHaveBeenCalledWith(false);
    expect(component.activeModal.close).toHaveBeenCalled();
  });
});