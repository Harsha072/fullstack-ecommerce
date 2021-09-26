import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import {ProductCategoryServiceService} from 'src/app/services/product-category-service.service'
import { ActivatedRoute } from '@angular/router';
import {ProductServiceService} from 'src/app/services/product-service.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  products_category : ProductCategory[];
  constructor(private productCategory : ProductServiceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.listProductCategory();
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
