import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoadIndicatorService } from '../services/load-indicator.service';
import { UserApiService } from '../services/user-api.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userList: any;

  tabs = [
    { id: 1, text: "Admin" },
    { id: 2, text: "User" },
  ];
  constructor(private userService: UserApiService,
    public loadIndicator: LoadIndicatorService,
    private router: Router,
    private jwtHelper: JwtHelperService  ) { }

  isUserAuthenticated() {
    const token: any = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    else {
      return false;
    }
  }

  ngOnInit(): void {
    this.userService.GetUsersByRole(1).subscribe(res => {
      this.userList = res;
    })
  }

  GetUsersByRole(e: any) {
    this.loadIndicator.visibleIndicator = true;
    this.userService.GetUsersByRole(e.itemData.id).subscribe(res => {
      this.userList = res;
      this.loadIndicator.visibleIndicator = false;
    })
  }
  openUser(e: any) {
    if (e.columnIndex == 0 && e.rowType == 'data') {
      localStorage.setItem("selectedUser", JSON.stringify(e.data));
      this.router.navigate(['/users/' + e.value]);
    }
  }
}
