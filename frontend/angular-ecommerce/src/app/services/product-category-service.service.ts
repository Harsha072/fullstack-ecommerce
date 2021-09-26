import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductCategoryServiceService {

 private  baseUrl =environment.ecommerceApiUrl+'/product-category';
 constructor(private httpClient : HttpClient) { }

//  getProductCategory():Observable<ProductCategory[]>{
//   return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
//     map(response =>
    
//       response._embedded.productCategory)
//     );
//  }

// }

// interface GetResponse{
//   _embedded:{
//     productCategory: ProductCategory [];
//   }
 }
