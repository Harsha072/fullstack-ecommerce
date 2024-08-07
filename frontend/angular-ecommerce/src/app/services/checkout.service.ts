import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = environment.ecommerceApiUrl+'/checkout/purchase';
  constructor(private httpClient:HttpClient) { }
  placeOrder(purchase:Purchase):Observable<any>{
    console.log(purchase.orderItem);
return this.httpClient.post<Purchase>(this.purchaseUrl,purchase);
  }
}
