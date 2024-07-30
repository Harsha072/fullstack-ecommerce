import { TestBed } from "@angular/core/testing";
import { CartItem } from "../common/cart-item";
import { CartService } from "./cart.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CartService', () => {

  let cartService: CartService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });
    cartService = TestBed.inject(CartService);
    httpTestingController = TestBed.inject(HttpTestingController);
    cartService.clearCartItems();
  });

  afterEach(() => {
    httpTestingController.verify(); 
    cartService.clearCartItems();// Verify that no requests are outstanding
  });

  it('should add item to cart', () => {
    const cartItem: CartItem = {
      id: 1,
      name: 'Test Item',
      unitPrice: 10,
      quantity: 1,
      imageUrl: "www.test.com"
    };

    cartService.addToCartService(cartItem);

    expect(cartService.cartItems.length).toBe(1);
    expect(cartService.cartItems[0]).toEqual(cartItem);
  });

  it('should increment quantity of existing item in cart', () => {
    const cartItem: CartItem = {
      id: 1,
      name: 'Test Item',
      unitPrice: 10,
      quantity: 1,
      imageUrl: "www.test.com"
    };

    cartService.addToCartService(cartItem);
    cartService.addToCartService(cartItem);

    expect(cartService.cartItems.length).toBe(1);
    expect(cartService.cartItems[0].quantity).toBe(2); // corrected quantity increment
  });

  it('should compute cart totals correctly', () => {
    const cartItem1: CartItem = {
      id: 1,
      name: 'Test Item 1',
      unitPrice: 10,
      quantity: 2,
      imageUrl: "www.test.com"
    };

    const cartItem2: CartItem = {
      id: 2,
      name: 'Test Item 2',
      unitPrice: 5,
      quantity: 3,
      imageUrl: "www.test.com"
    };

    cartService.addToCartService(cartItem1);
    cartService.addToCartService(cartItem2);

    cartService.computeCartTotals();

    cartService.totalPrice.subscribe(price => {
      expect(price).toBe(35);
    });
    cartService.totalQuantity.subscribe(quantity => {
      expect(quantity).toBe(5);
    });
  });

  it('should decrement quantity of item in cart', () => {
    const cartItem: CartItem = {
      id: 1,
      name: 'Test Item',
      unitPrice: 10,
      quantity: 2,
      imageUrl: "www.test.com"
    };

    cartService.addToCartService(cartItem);

    cartService.decrementQuantityService(cartItem);

    expect(cartService.cartItems.length).toBe(1);
    expect(cartService.cartItems[0].quantity).toBe(1); // corrected quantity decrement
  });

  // it('should remove an item from cart', () => {
  //   const cartItem: CartItem = {
  //     id: 1,
  //     name: 'Test Item',
  //     unitPrice: 10,
  //     quantity: 1,
  //     imageUrl: "www.test.com"
  //   };

  //   cartService.addToCartService(cartItem);

  //   cartService.removeItem(cartItem);

  //   expect(cartService.cartItems.length).toBe(0);
  // });
});