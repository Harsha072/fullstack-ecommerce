import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  //array of cart item object
  cartItems: CartItem[] = [];
  cartStorageItems: any[] = [];
  //this value of totalPrice can be sent to all subscribers using subject
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = localStorage;
  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if (data != null) {
      this.cartItems = data;

      //compute total based on data that is read from stroage
      this.computeCartTotals();
    }


  }

  addToCartService(theCartItem: CartItem) {
    //check if we already have the item
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;
console.log(this.cartItems.length);
    if (this.cartItems.length > 0) {

      existingCartItem = this.cartItems.find(tempItem => tempItem.id == theCartItem.id);
    }
    //check if we found it
    alreadyExistsInCart = (existingCartItem != undefined);


    //find the item in the cart based on item id
    //check if we found it
    if (alreadyExistsInCart) { existingCartItem.quantity++; }
    else { this.cartItems.push(theCartItem); }
    //compute cart total price and total quantity
    // this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let currentItemsIncart of this.cartItems) {
      totalPriceValue += currentItemsIncart.quantity * currentItemsIncart.unitPrice;
      totalQuantityValue += currentItemsIncart.quantity;
    }
    //now publish new values....all subscribers will receive this new values
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    this.logCartData(totalPriceValue, totalQuantityValue);
    //save cart data int storage 
    this.persistCartItems();
  }

  clearCartItems() {  
    this.cartItems.length = 0;
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    for (let data of this.cartItems) {

      const subtotal = data.quantity * data.unitPrice;
      console.log(`name =${data.name},subtotal=${subtotal},quantity =${totalQuantityValue} , toalprice=${totalPriceValue}`);
    }

  }
  decrementQuantityService(cartItem: CartItem) {
    cartItem.quantity--
    if (cartItem.quantity == 0) {
      this.removeItem(cartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  removeItem(cartItem: CartItem) {

    const itemIndex = this.cartItems.findIndex(temp => temp.id === cartItem.id);


    if (itemIndex > -1) {

      const cartItemsFromStorage = localStorage.getItem('cartItems');
      if (cartItemsFromStorage) {

        this.cartStorageItems = JSON.parse(cartItemsFromStorage);

        this.cartStorageItems.splice(itemIndex, 1);


        localStorage.setItem('cartItems', JSON.stringify(this.cartStorageItems));


        this.cartItems.splice(itemIndex, 1);
        this.computeCartTotals();
      }
    }
  }
}
