import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { gql } from 'graphql-tag';
import { Employee } from '../models/employee';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];

  constructor(
    private router: Router,
    private apollo: Apollo,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    //Force Redirct
    const loginCookie = this.cookieService.get('login');
    if (!loginCookie) {
      this.router.navigate(['login']);
      return; 
    }
    this.getAllEmployees();
  }

  //Update Employee
  updateEmployee(employee: Employee) {
    this.router.navigate(['update_employee', { employee: JSON.stringify(employee) }]);
  }

  // Delete Employee w/ warning
  deleteEmployee(employee: Employee) {
    const isConfirmed = confirm(`Are you sure you want to delete ${employee.first_name} ${employee.last_name} permanently?`);
    if (isConfirmed) {
      this.deleteEmployeeById(employee._id);
    }
  }

  // View Details Page
  viewEmployeeDetails(employee: Employee) {
    this.router.navigate(['view_employee', { employee: JSON.stringify(employee) }]);
  }

  // Add Employee
  goToAddEmployee() {
    this.router.navigate(['add_employee']);
  }

  //Get All employees
  getAllEmployees() {
    const GET_ALL_EMPLOYEES = gql`
      query GetAllEmployees {
        getAllEmployees {
          _id
          first_name
          last_name
          email
          gender
          salary
        }
      }
    `;

    this.apollo.query({
      query: GET_ALL_EMPLOYEES
    }).subscribe((result: any) => {
      this.employees = result.data.getAllEmployees;
    }, (error) => {
      console.error('Error fetching employees:', error);
    });
  }

  deleteEmployeeById(id: string) {
    const DELETE_EMPLOYEE = gql`
      mutation DeleteEmployee($id: ID!) {
        deleteEmployee(_id: $id) {
          _id
        }
      }
    `;

    this.apollo.mutate({
      mutation: DELETE_EMPLOYEE,
      variables: {
        id
      }
    }).subscribe(() => {
      // Remove the deleted employee from the list
      this.employees = this.employees.filter(employee => employee._id !== id);
    }, (error) => {
      console.error('Error deleting employee:', error);
    });
  }
}
