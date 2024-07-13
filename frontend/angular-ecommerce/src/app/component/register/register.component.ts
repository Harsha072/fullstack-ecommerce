import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: any = { firstName: '', lastName: '', email: '' };

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.authService.register(this.user).subscribe(
      (response: any) => {
        console.log('Registration successful: ', response.message);
        // Optionally show a success message or navigate to another page
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Registration error: ', error);
        // Optionally show an error message to the user
      }
    );
  }
}