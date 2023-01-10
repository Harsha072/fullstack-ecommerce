import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {of} from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class ShopFormserviceService {

  private  baseUrl =environment.ecommerceApiUrl;
  constructor(private httpClient : HttpClient) { }
 
  getCreditCardMonths(startMonth:number):Observable<number[]>{
    let data :number[]=[];

    for(let theMonth= startMonth; theMonth<=12;theMonth++){
      data.push(theMonth);
    }
    return of (data);
  }
  getCreditCardYears():Observable<number[]>{
    const startYear :number=new Date().getFullYear();
    const endYear :number= startYear+10;
let data :number[]=[];
    for(let theyear=startYear; theyear<=endYear;theyear++){
       data.push(theyear);
    }
    return of (data);
  }

  getCountry():Observable<Country[]>{
    return this.httpClient.get<GetResponseContry>(`${this.baseUrl}/country`).pipe(
      map(response => response._embedded.country)
    );
    
  }
  getState(theContryCode:string):Observable<State[]>{
    return this.httpClient.get<GetResponseState>(`${this.baseUrl}/states/search/findByCountryCode?code=${theContryCode}`).pipe(
      map(response => response._embedded.state)
    );
    
  }
  

}
interface GetResponseContry{
  _embedded:{
    country:Country[];
  }
}
interface GetResponseState{
  _embedded:{
    state:State[];
  }
}
