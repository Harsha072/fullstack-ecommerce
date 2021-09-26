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
export class ProductServiceService {
  getProductDeatils(theproductId: number) :Observable<Product> {
    const detailsUrl = `${this.baseUrl}/${theproductId}`;
    return   this.httpClient.get<Product>(detailsUrl);
  }
 
  private baseUrl = environment.ecommerceApiUrl+'/products';
  constructor(private httpClient : HttpClient) { }

getPoductList(theCategoryId : number): Observable<Product[]>{

  const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
  console.log("the url ",searchUrl);
  // need to build based on category id.....and ca
  return this.httpClient.get<GetResponse>(searchUrl).pipe(
    map(response =>
    
      response._embedded.products)
    );
    
}

getPoductListPaginate(thePage:number,thePageSize:number,theCategoryId : number): Observable<GetResponse>{

  const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`+`&page=${thePage}&size=${thePageSize}`;
  console.log("the url ",searchUrl);
  // need to build based on category id.....and page and size
  return this.httpClient.get<GetResponse>(searchUrl);
    
}
getProductCategory():Observable<ProductCategory[]>{
  const categoryUrl = environment.ecommerceApiUrl+'/product-category';
  return this.httpClient.get<GetResponseCategory>(categoryUrl).pipe(
    map(response =>
    
      response._embedded.productCategory)
    );
 }


 searchProduct(theKeyword:string):Observable<Product[]>{
  const searchUrl =  `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
  console.log("the search url "+searchUrl);
  return this.getProducts(searchUrl);
 }
 searchProductPaginate(thePage:number,thePageSize:number,theKeyword : string): Observable<GetResponse>{

  const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`+`&page=${thePage}&size=${thePageSize}`;
  console.log("the url ",searchUrl);
  // need to build based on name.....and page and size
  return this.httpClient.get<GetResponse>(searchUrl);
    
}


  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}
interface GetResponseCategory{
  _embedded:{
    productCategory: ProductCategory [];
  }
}

interface GetResponse{
  _embedded:{
    products: Product[];
  },
  page:{
    size:number,
    totalElements:number,
    totalPages:number,
    number:number
  }
}
