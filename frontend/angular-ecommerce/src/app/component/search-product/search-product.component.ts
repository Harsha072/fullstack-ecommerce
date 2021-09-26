import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductServiceService } from 'src/app/services/product-service.service';
@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.css']
})
export class SearchProductComponent implements OnInit {
products :Product[];
keyword:string;
  constructor(private productService : ProductServiceService, private router: Router) { 
   
  }

  ngOnInit(): void {
   
  }

  doSearch(mytext:string) {
   console.log(`value =${mytext}`);
   this.router.navigateByUrl(`/search/${mytext}`);

  }

}
