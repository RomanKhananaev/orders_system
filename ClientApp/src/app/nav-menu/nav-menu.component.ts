import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  loggedUser: any;
  loggedUserStr: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loggedUserStr = localStorage.getItem("user");
    this.loggedUser = JSON.parse(this.loggedUserStr);
/*    console.log("UserLogged: ", this.loggedUser);*/
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logOut() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    this.router.navigate(['/login']);
  }
}
