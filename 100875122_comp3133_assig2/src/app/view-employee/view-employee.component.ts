import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../models/employee';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrl: './view-employee.component.css'
})
export class ViewEmployeeComponent implements OnInit {
  employee: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService
  ) {}

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
}
