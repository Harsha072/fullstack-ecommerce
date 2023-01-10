import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductServiceService } from 'src/app/services/product-service.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.componentgrid.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
products : Product[] = [];
currentCategoryId : number=1;
previousCategoryId: number=1;
searchMode:boolean=false;

//new properties for pagination
thePageNumber:number=1;
thePageSize:number=6;
theTotalElements:number=0;

previousKeyword:string=null;
 

  constructor(private productService : ProductServiceService, private route: ActivatedRoute,private cartService:CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProductList();
    });
  }

  listProductList(){
this.searchMode = this.route.snapshot.paramMap.has('keyword');
if(this.searchMode){
   this.handleSearchProducts();
}
else{
    this.handleListProducts();
  }
  }
  
  handleSearchProducts() {
    const thekeyword:string = this.route.snapshot.paramMap.get('keyword');
// if we have different keyword than previous then set page nos to 1
if(this.previousKeyword!=thekeyword){
  this.thePageNumber=1;
}
this.previousKeyword= thekeyword;


    this.productService.searchProductPaginate(this.thePageNumber -1,this.thePageSize,thekeyword).subscribe(this.processResult());
    
  }

  handleListProducts(){
    //check if id param is available 
    const hasCategoryId : boolean= this.route.snapshot.paramMap.has('id');
    console.log("it has id ",hasCategoryId);
    //if it has id change it to number
    if(hasCategoryId){
 this.currentCategoryId =+this.route.snapshot.paramMap.get('id');
 console.log("the id ",this.currentCategoryId);
    }
    else{
      //if not present set it to default
      this.currentCategoryId = 1;

    }
    //now get products based on id
    //for pagination...when we are already on page 4 for a particular category and when we click on another category
    //it should start with page 1 therefore check if we have different category id
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber=1;
    }
    this.previousCategoryId = this.currentCategoryId;
    //pagenumber -
    //process result is for mapping the result from json
    console.log(`current category id=${this.currentCategoryId}, thepagenumber=${this.thePageNumber}`);
     this.productService.getPoductListPaginate(this.thePageNumber -1,this.thePageSize,this.currentCategoryId).subscribe(this.processResult());

  }
  processResult()  {
    return data =>{
    this.products=data._embedded.products;
    this.thePageNumber = data.page.number+1;
    this.thePageSize = data.page.size;
    this.theTotalElements = data.page.totalElements;
    }
  }
  updatePageSize(pageSize:number){
    this.thePageSize=pageSize;
    this.thePageNumber=1;
    this.listProductList();
  }
  addToCart(product:Product){
  console.log(product.name+" "+product.unitPrice);
//first create a cart item to add to cart
const cartItem = new CartItem(product);
this.cartService.addToCartService(cartItem);

  }
}
