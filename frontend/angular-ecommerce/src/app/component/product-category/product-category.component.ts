import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import {ProductCategoryServiceService} from 'src/app/services/product-category-service.service'
import { ActivatedRoute } from '@angular/router';
import {ProductServiceService} from 'src/app/services/product-service.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
  isAuthenticated: boolean = false;
  products_category : ProductCategory[];
  constructor(private productCategory : ProductServiceService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {

    this.authService.isAuthenticated$.subscribe(
      result => {
        this.isAuthenticated = result;
        this.listProductCategory();
      }
    );
   
  }
  listProductCategory(){
this.productCategory.getProductCategory().subscribe(
  data =>{
    this.products_category = data;
    console.log("array of category ",this.products_category)
  }
)
  }

}
