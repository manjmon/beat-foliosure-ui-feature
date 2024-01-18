import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PipelineService } from '../../services/pipeline.service';
import { PipelineDashboardComponent } from './pipeline-dashboard.component';

describe('PipelineDashboardComponent', () => {
  let component: PipelineDashboardComponent;
  let fixture: ComponentFixture<PipelineDashboardComponent>;

  beforeEach(() => {
    const pipelineServiceStub = () => ({
      getPipeLineDashBoard: () => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PipelineDashboardComponent],
      providers: [{ provide: PipelineService, useFactory: pipelineServiceStub }]
    });
    fixture = TestBed.createComponent(PipelineDashboardComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`width has default value`, () => {
    expect(component.width).toEqual(0);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getDashBoardGraphs').and.callThrough();
      component.ngOnInit();
      expect(component.getDashBoardGraphs).toHaveBeenCalled();
    });
  });

  describe('getDashBoardGraphs', () => {
    it('makes expected calls', () => {
      const pipelineServiceStub: PipelineService = fixture.debugElement.injector.get(
        PipelineService
      );
      spyOn(pipelineServiceStub, 'getPipeLineDashBoard').and.callThrough();
      component.getDashBoardGraphs();
      expect(pipelineServiceStub.getPipeLineDashBoard).toHaveBeenCalled();
    });
  });
  describe('onResized', () => {
    it('should update the width property with the new width from the event', () => {
      // Arrange
      const event = {
        newRect: {
          width: 100 // Sample width value
        }
      };

      // Act
      component.onResized(event);

      // Assert
      expect(component.width).toEqual(100);
    });

    it('should not update the width property if the newRect is undefined', () => {
      // Arrange
      const event = {
        // newRect is undefined

        // width: 100 // Sample width value
      };

      // Act
      component.onResized(event);

      // Assert
      expect(component.width).toBeUndefined(); // Ensure width remains unchanged
    });
  });
});
