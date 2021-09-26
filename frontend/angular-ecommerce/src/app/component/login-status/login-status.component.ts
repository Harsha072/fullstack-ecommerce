import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {
isAuthenticated :boolean=false;
userFullName:string;
storage:Storage=sessionStorage;
  constructor(private oktaAuthService: OktaAuthService) {
   }

  ngOnInit(): void {
 //subscribe to authentication state changes
 this.oktaAuthService.$authenticationState.subscribe(
(result)=>{
  this.isAuthenticated=result;
  this.getUserDetails();
}

 )

 
  }
  getUserDetails() {

    if(this.isAuthenticated){
      //fetch logged in user detais
      this.oktaAuthService.getUser().then(
        res=>{
          this.userFullName=res.name
          //retrive the users email from authentication response
          const theeEmail = res.email
          this.storage.setItem('userEmail',JSON.stringify(theeEmail));
        }
      )
    }
}
logout(){
  this.oktaAuthService.signOut();
}
  }



