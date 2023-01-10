import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductServiceService } from 'src/app/services/product-service.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
product:Product= new Product();
  constructor(private productService :ProductServiceService , private route :ActivatedRoute,private cartService:CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.handleProductDetails()
    })
  }
  handleProductDetails() {
  const theproductId :number = +this.route.snapshot.paramMap.get('id');
this.productService.getProductDeatils(theproductId).subscribe(
  data =>{this.product=data}
)
    
  }
  addCartFromDetail(product:Product){
    console.log(product.name+" "+product.unitPrice);
  //first create a cart item to add to cart
  const cartItem = new CartItem(product);
  this.cartService.addToCartService(cartItem);
  
    }


}
