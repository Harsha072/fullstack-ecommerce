import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
cartItems:CartItem[]=[];
totalPrice:number=0;
totalQuantity:number=0;


  constructor(private cartService:CartService) { }

  ngOnInit(): void {
    console.log("calling cart details");
    this.listCartDetails();
  }
  listCartDetails() {
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe(
      data=>{
        this.totalPrice=data;
      }
    )
    this.cartService.totalQuantity.subscribe(
      data=>{
        this.totalQuantity = data;
      }
    )
    this.cartService.computeCartTotals();
  }

  incrementQuantity(cartItem:CartItem){
this.cartService.addToCartService(cartItem);

  }
  decrementQuantity(cartItem:CartItem){
    console.log("decrementing quantity");
    this.cartService.decrementQuantityService(cartItem);
    
      }
      removeItem(cartItem:CartItem){
        this.cartService.removeItem(cartItem);
      }
}
