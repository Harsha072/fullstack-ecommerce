import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const user = { username: 'testuser', password: 'testpassword' };
    service.register(user).subscribe(response => {
      expect(response).toBeTruthy();
      // Add additional assertions for the response if needed
    });

    const req = httpMock.expectOne(`${service.baseUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush({}); // Mock response data
  });

  it('should login with credentials', () => {
    const credentials = { username: 'testuser', password: 'testpassword' };
    service.login(credentials).subscribe(response => {
      expect(response).toBeTruthy();
      // Add additional assertions for the response if needed
    });

    const req = httpMock.expectOne(`${service.baseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'testtoken' }); // Mock response data

    expect(localStorage.getItem('authToken')).toBe('testtoken');
 
  });

  it('should check if user is logged in', () => {
    localStorage.setItem('authToken', 'testtoken');
    expect(service.isLoggedIn()).toBe(true);

    localStorage.removeItem('authToken');
    expect(service.isLoggedIn()).toBe(false);
  });



  it('should logout user', () => {
    localStorage.setItem('authToken', 'testtoken');
    localStorage.setItem('cartItems', 'testcartitems');
    service.logout();

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('cartItems')).toBeNull();
 
  });

  it('should get auth token', () => {
    const token = 'testtoken';
    localStorage.setItem('authToken', token);

    const result = service.getToken();
    expect(result).toBe(token);
  });
});