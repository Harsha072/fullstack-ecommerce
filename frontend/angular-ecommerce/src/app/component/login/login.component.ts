import { Component, OnInit } from '@angular/core';
import myAppConfig from 'src/app/config/my-app-config';
import * as OktaSignIn from '@okta/okta-signin-widget';
import { OktaAuthService } from '@okta/okta-angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   oktaSignin:any;

  constructor(private oktaAuthService:OktaAuthService) {
    this.oktaSignin= new OktaSignIn({
      logo: 'assets/images/products/log1.png',
      features:{
        registration:true,
      },
      baseUrl:myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId:myAppConfig.oidc.clientId,
      redirectUri:myAppConfig.oidc.redirectUri,
      authParams:{
        pkce:true,
        issuer:myAppConfig.oidc.issuer,
        scopes :myAppConfig.oidc.scopes
      }
    });

   }

  ngOnInit(): void {
    this.oktaSignin.remove();
      this.oktaSignin.renderEl({
        el:'#signin-widget'},
        (response:any)=>{
          if(response.status==='SUCCESS'){
            this.oktaAuthService.signInWithRedirect();
          }

        },
        (error:any)=>{
          throw error;
        }

      )

  }

}
