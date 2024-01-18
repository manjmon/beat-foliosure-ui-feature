import { TestBed } from '@angular/core/testing';
import { Router,NavigationStart } from '@angular/router';
import { Subject } from 'rxjs';
import { AlertService } from './alert.service';

describe("AlertService", () => {
  let service: AlertService;
  let routerMock = { navigate: jasmine.createSpy('navigate'), events: new Subject() };

  beforeEach(() => {
    const routerStub = () => ({ events: { subscribe: f => f({}) } });
    TestBed.configureTestingModule({
      providers: [AlertService, { provide: Router, useFactory: routerStub,useValue: routerMock }]
    });
    service = TestBed.inject(AlertService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a success message', (done) => {
    service.getMessage().subscribe(message => {
      expect(message).toEqual({ type: 'success', text: 'Success!' });
      done();
    });

    service.success('Success!');
  });

  it('should send an error message', (done) => {
    service.getMessage().subscribe(message => {
      expect(message).toEqual({ type: 'error', text: 'Error!' });
      done();
    });

    service.error('Error!');
  });
});
