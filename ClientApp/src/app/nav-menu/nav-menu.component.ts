import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  loggedUserName: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loggedUserName = localStorage.getItem("name");
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logOut() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("name");
    this.router.navigate(['/login']);
  }
}
