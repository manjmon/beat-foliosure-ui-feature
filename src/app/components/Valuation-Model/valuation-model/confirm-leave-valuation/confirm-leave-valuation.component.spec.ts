import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfirmLeaveValuationComponent } from './confirm-leave-valuation.component';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

describe('ConfirmLeaveValuationComponent', () => {
  let component: ConfirmLeaveValuationComponent;
  let fixture: ComponentFixture<ConfirmLeaveValuationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ConfirmLeaveValuationComponent],
      providers: [NgbActiveModal
      ]
    });
    fixture = TestBed.createComponent(ConfirmLeaveValuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('CloseModal', () => {
    it('makes expected call', ()=>{
        const colseModal = 'Yes'
        spyOn(component, 'CloseModal').and.callThrough();
        component.CloseModal(colseModal);
        expect(component.CloseModal).toHaveBeenCalled();
    })
  })
});