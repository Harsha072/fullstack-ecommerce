import { Component, OnInit } from '@angular/core';
 // EEnsure this isthis correct is the cyourect path to 
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string;
  storage: Storage = sessionStorage;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.authService.isAuthenticated$.subscribe(
      result => {
        this.isAuthenticated = result;
        this.getUserDetails();
      }
    );

    // Check authentication status on component load
    this.isAuthenticated = this.authService.isLoggedIn();
    if (this.isAuthenticated) {
      this.getUserDetails();
    }
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      const user = this.authService.getUserDetails();
      if (user) {
        this.userFullName = user.fullName;
        // Retrieve the user's email from authentication response
        const theEmail = user.email;
        this.storage.setItem('userEmail', JSON.stringify(theEmail));
      }
    }
  }

  logout() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
}