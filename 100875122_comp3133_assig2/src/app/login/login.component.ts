import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { gql } from 'graphql-tag';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  warning: string = '';

  constructor(
    private router: Router,
    private apollo: Apollo,
    private cookieService: CookieService
  ) { }

  goToSignup() {
    this.router.navigate(['signup']);
  }

  login() {
    const LOGIN_QUERY = gql`
      query Login($username: String!, $password: String!) {
        login(username: $username, password: $password)
      }
    `;

    this.apollo.query({
      query: LOGIN_QUERY,
      variables: {
        username: this.username,
        password: this.password
      }
    }).subscribe((result: any) => {
      const loginResponse = result.data.login;
      if (loginResponse === 'Login Success') {
        // Set cookie upon successful login
        this.cookieService.set('login', this.username);
        
        // Redirect to employee list page
        this.router.navigate(['employee-list']);
      } else {
        // Display warning message
        this.warning = loginResponse;
      }
    }, (error) => {
      console.error('Error logging in:', error);
      this.warning = 'An error occurred during login.';
    });
  }
}
