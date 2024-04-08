import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { gql } from 'graphql-tag';
import { Employee } from '../models/employee';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})
export class UpdateEmployeeComponent implements OnInit {
  employee: Employee;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apollo: Apollo,
    private cookieService: CookieService
  ) {
    this.employee = {} as Employee; 
  }

  ngOnInit(): void {
    // Check if the "login" cookie exists
    const loginCookie = this.cookieService.get('login');
    if (!loginCookie) {
      // Redirect to login page if the "login" cookie is not detected
      this.router.navigate(['login']);
      return; // Stop further execution
    }

    // Retrieve employee data
    this.route.params.subscribe(params => {
      this.employee = JSON.parse(params['employee']);
    });
  }

  goBackToList() {
    this.router.navigate(['employee-list']);
  }

  saveEmployee() {
    const UPDATE_EMPLOYEE = gql`
      mutation UpdateEmployee($id: ID!, $firstName: String!, $lastName: String!, $email: String!, $gender: String!, $salary: Float!) {
        updateEmployee(_id: $id, first_name: $firstName, last_name: $lastName, email: $email, gender: $gender, salary: $salary) {
          _id
          email
          first_name
          gender
          last_name
          salary
        }
      }
    `;
  
    this.apollo.mutate({
      mutation: UPDATE_EMPLOYEE,
      variables: {
        id: this.employee._id,
        firstName: this.employee.first_name,
        lastName: this.employee.last_name,
        email: this.employee.email,
        gender: this.employee.gender,
        salary: this.employee.salary
      }
    }).subscribe(
      (result: any) => {
        // Handle success
        console.log('Employee updated successfully');
        this.router.navigate(['employee-list']);
      },
      (error) => {
        // Handle error
        console.error('Error updating employee:', error);
      }
    );
  }
}
