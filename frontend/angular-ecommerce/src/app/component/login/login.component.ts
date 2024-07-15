import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Add this line

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [FormsModule] // Add this line
})
export class LoginComponent {
  credentials: any = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    console.log('Login credentials: ', this.credentials);
    this.authService.login(this.credentials).subscribe((response) => {
      localStorage.setItem('token', response);
      if(localStorage.getItem('cartItems')) {
        this.router.navigate(['checkout']);
      }
      else{
        this.router.navigate(['products']);
      }
  
     
    }, error => {
      console.error('Login error: ', error);
    });
  }
}
