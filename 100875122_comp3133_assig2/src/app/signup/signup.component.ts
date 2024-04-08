import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { gql } from 'graphql-tag';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  warning: string = '';

  constructor(private router: Router, private apollo: Apollo) { }

  goToLogin() {
    this.router.navigate(['login']);
  }

  signup() {
    if (!this.username || !this.password || !this.confirmPassword || !this.email) {
      this.warning = 'Please fill in all fields.';
      return;
    }

    // Check if passwords match
    if (this.password !== this.confirmPassword) {
      this.warning = 'Passwords do not match.';
      return;
    }

    // Perform GraphQL signup mutation
    const SIGNUP_USER = gql`
      mutation CreateUser($username: String!, $password: String!, $email: String!) {
        createUser(username: $username, password: $password, email: $email) {
          _id
          username
          email
        }
      }
    `;

    this.apollo.mutate({
      mutation: SIGNUP_USER,
      variables: {
        username: this.username,
        password: this.password,
        email: this.email
      }
    }).subscribe((result: any) => {
      this.router.navigate(['login']);
    }, (error) => {
      console.error('Error signing up:', error);
      this.warning = 'An error occurred during signup.';
    });
  }
}
