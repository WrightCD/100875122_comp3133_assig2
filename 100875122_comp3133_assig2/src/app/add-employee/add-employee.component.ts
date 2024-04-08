import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { gql } from 'graphql-tag';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  gender: string = 'Male'; 
  salary: number = 0; 
  warning: string = '';

  constructor(private router: Router, private apollo: Apollo, private cookieService: CookieService) { }

  ngOnInit(): void {
    const loginCookie = this.cookieService.get('login');
    if (!loginCookie) {
      this.router.navigate(['login']);
      return; 
    }
  }

  goBackToList() {
    this.router.navigate(['employee-list']);
  }

  saveEmployee() {
    if (!this.firstName || !this.lastName || !this.email || !this.gender || !this.salary) {
      this.warning = 'Please fill in all fields.';
      return;
    }

    // Perform GraphQL mutation to add employee
    const CREATE_EMPLOYEE = gql`
      mutation CreateEmployee($firstName: String!, $lastName: String!, $email: String!, $gender: String!, $salary: Float!) {
        createEmployee(first_name: $firstName, last_name: $lastName, email: $email, gender: $gender, salary: $salary) {
          _id
          first_name
          last_name
          email
          gender
          salary
        }
      }
    `;

    this.apollo.mutate({
      mutation: CREATE_EMPLOYEE,
      variables: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        gender: this.gender,
        salary: this.salary
      }
    }).subscribe((result: any) => {
      this.router.navigate(['employee-list']);
    }, (error) => {
      console.error('Error adding employee:', error);
      this.warning = 'An error occurred while adding employee.';
    });
  }
}
