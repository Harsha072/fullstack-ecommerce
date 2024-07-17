import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CheckoutComponent } from './checkout.component';
import { CheckoutService } from '../../services/checkout.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ShopFormserviceService } from 'src/app/services/shop-formservice.service';
import { CartService } from 'src/app/services/cart.service';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckoutComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [CheckoutService,ShopFormserviceService, { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); } },CartService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have method onSubmit', () => {
    expect(component.onSubmit).toBeDefined();
  });
  

  // Add more test cases here
});