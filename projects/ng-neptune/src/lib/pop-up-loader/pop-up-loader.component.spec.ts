import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PopUpLoaderComponent } from './pop-up-loader.component';

describe('PopUpLoaderComponent', () => {
  let component: PopUpLoaderComponent;
  let fixture: ComponentFixture<PopUpLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PopUpLoaderComponent]
    });
    fixture = TestBed.createComponent(PopUpLoaderComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`customwidth has default value`, () => {
    expect(component.customwidth).toEqual(`456px`);
  });
});
