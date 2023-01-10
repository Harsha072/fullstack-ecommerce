import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorsService implements HttpInterceptor {

  constructor(private oktaAuth: OktaAuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request,next));
  }
  private async handleAccess(request:HttpRequest<any>,next:HttpHandler):Promise<HttpEvent<any>> {
//only add access token for secured end points
const theEndpoint = environment.ecommerceApiUrl+'/orders';
const securedEndpoints =[theEndpoint];

if(securedEndpoints.some(url=>request.urlWithParams.includes(url))){
  //get the access token
console.log("true from interceptor",request.urlWithParams," ",securedEndpoints);
  const accessToken = await this.oktaAuth.getAccessToken();

  //clone request because request cannot be changed therfore cloning
  //add new handler with access token'
  request = request.clone({
    setHeaders:{
      Authorization:'Bearer ' + accessToken
    }
  });
  
}
else{
  console.log("other request", request.urlWithParams);
}
return next.handle(request).toPromise(); 
  
  }
}


