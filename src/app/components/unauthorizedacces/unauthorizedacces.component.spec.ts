import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UnauthorizedaccesComponent } from './unauthorizedacces.component';

describe('UnauthorizedaccesComponent', () => {
  let component: UnauthorizedaccesComponent;
  let fixture: ComponentFixture<UnauthorizedaccesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [UnauthorizedaccesComponent]
    });
    fixture = TestBed.createComponent(UnauthorizedaccesComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`isHideAuthImage has default value`, () => {
    expect(component.isHideAuthImage).toEqual(true);
  });
});
