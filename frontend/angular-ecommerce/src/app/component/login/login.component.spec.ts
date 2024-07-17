import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

class MockAuthService {
  login(credentials: any) {
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      return of('fake-token');
    } else {
      return throwError('Invalid credentials');
    }
  }
}

class MockRouter {
  navigate(path: string[]) {
   
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService login method with credentials', () => {
    const authServiceSpy = spyOn(authService, 'login').and.callThrough();
    component.credentials = { email: 'test@example.com', password: 'password' };
    component.login();
    expect(authServiceSpy).toHaveBeenCalledWith(component.credentials);
  });

  it('should navigate to checkout if cart items are present after login', () => {
    const routerSpy = spyOn(router, 'navigate');
    spyOn(authService, 'login').and.returnValue(of('fake-token'));
    localStorage.setItem('cartItems', JSON.stringify([{ id: 1, name: 'item1' }]));
    
    component.credentials = { email: 'test@example.com', password: 'password' };
    component.login();
    expect(routerSpy).toHaveBeenCalledWith(['checkout']);
  });

  it('should navigate to products if no cart items are present after login', () => {
    const routerSpy = spyOn(router, 'navigate');
    spyOn(authService, 'login').and.returnValue(of('fake-token'));
    localStorage.removeItem('cartItems');
    
    component.credentials = { email: 'test@example.com', password: 'password' };
    component.login();
    expect(routerSpy).toHaveBeenCalledWith(['products']);
  });

  it('should handle login error', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    spyOn(authService, 'login').and.returnValue(throwError('Invalid credentials'));

    component.credentials = { email: 'wrong@example.com', password: 'wrongpassword' };
    component.login();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Login error: ', 'Invalid credentials');
  });
});