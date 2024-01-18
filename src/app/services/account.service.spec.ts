import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AccountService } from './account.service';
import { RouterTestingModule } from '@angular/router/testing';
import * as moment from 'moment';
import { Router } from '@angular/router';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;
  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AccountService, 
        { provide: Router, useValue: routerMock },
        { provide: 'BASE_URL', useValue: 'http://localhost:5000/' } // provide a value for BASE_URL
      ]
    });

    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests
  });

  it('should make a POST request to login a user', () => {
    const loginData = { username: 'test', password: 'test' };
  
    service.login(loginData).subscribe(response => {
      expect(response).toBeTruthy();
    });
  
    const req = httpMock.expectOne('http://localhost:5000/api/login'); // Update the URL here
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ ...loginData, refreshToken: '', grantType: 'password' });
  
    req.flush({ body: { accessToken: '12345' } }); // Mock response from server
  });

 
  it('should set session in local storage', () => {
    const authResult = {
      expiresIn: 60,
      permissions: ['read', 'write']
    };
  
    spyOn(localStorage, 'setItem');
    spyOn((service as any).cryptoService, 'getEncryptedValue').and.returnValue('encryptedPermissions');
  
    (service as any).setSession(authResult);
  
    const expiresAt = moment().add(authResult.expiresIn, 'minute').valueOf();
  
    expect(localStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(authResult));
    expect(localStorage.setItem).toHaveBeenCalledWith('userPermissions', 'encryptedPermissions');
  });

  it('should add a user', () => {
    const user = { name: 'Test User' };
    const response = { status: 'success' };

    service.addUser(user).subscribe(res => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(service.myAppUrl + 'api/user/add-or-update');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(user);
    req.flush(response);
  });

  it('should update a user', () => {
    const user = { name: 'Test User' };
    const response = { status: 'success' };

    service.updateUser(user).subscribe(res => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(service.myAppUrl + 'api/user/add-or-update');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(user);
    req.flush(response);
  });

  it('should get user by id', () => {
    const userId = '123';
    const response = { name: 'Test User' };

    service.getUserById(userId).subscribe(res => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(service.myAppUrl + 'api/user/getbyid');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userId);
    req.flush(response);
  });
  it('should get user permissions by email', () => {
    const response = { permissions: ['read', 'write'] };
  
    service.getUserPermissionByEmail().subscribe(res => {
      expect(res).toEqual(response);
    });
  
    const req = httpMock.expectOne(service.myAppUrl + 'api/user/getpermission');
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });
  
  it('should get user list', () => {
    const filter = { active: true };
    const response = [{ name: 'Test User' }];
  
    service.getUserList(filter).subscribe(res => {
      expect(res).toEqual(response);
    });
  
    const req = httpMock.expectOne(service.myAppUrl + 'api/user/get');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filter);
    req.flush(response);
  });
  
  it('should get user list for group', () => {
    const filter = { group: 'Test Group' };
    const response = [{ name: 'Test User' }];
  
    service.getUserListForGroup(filter).subscribe(res => {
      expect(res).toEqual(response);
    });
  
    const req = httpMock.expectOne(service.myAppUrl + 'api/user/get');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filter);
    req.flush(response);
  });
  it('should reset password', () => {
    const resetPasswordModel = { email: 'test@example.com', password: 'newPassword' };
    const response = { status: 'success' };
  
    service.resetPassword(resetPasswordModel).subscribe(res => {
      expect(res).toEqual(response);
    });
  
    const req = httpMock.expectOne(service.myAppUrl + 'api/user/resetpassword');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(resetPasswordModel);
    req.flush(response);
  });
  
  it('should update user subgroups', () => {
    const users = [{ id: '1', subGroups: ['group1', 'group2'] }];
    const response = { status: 'success' };
  
    service.UpdateUserSubGroups(users).subscribe(res => {
      expect(res).toEqual(response);
    });
  
    const req = httpMock.expectOne(service.myAppUrl + 'api/UpdateUserSubGroups');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(users);
    req.flush(response);
  });

 
  it('should get alert message time', () => {
    expect(service.getAlertMessageTime()).toBe(10000);
  });
  
  it('should get current user details', () => {
    const response = { name: 'Test User' };
  
    service.getCurrentUserDeatils().subscribe(res => {
      expect(res).toEqual(response);
    });
  
    const req = httpMock.expectOne(service.myAppUrl + 'api/user/GetCurrentUserData');
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });
  
  it('should export user list', () => {
    const response = new Blob();
  
    service.exportUserList().subscribe(res => {
      expect(res.body).toEqual(response);
    });
  
    const req = httpMock.expectOne(service.myAppUrl + 'api/users/download');
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });
});