import { Component, OnInit } from '@angular/core';
import { UserApiService } from '../services/user-api.service';
import notify from 'devextreme/ui/notify'
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginUser = {
    userName: 'rom.k',
    password: '15423562'
  }

  constructor(
    private userService: UserApiService,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) { }

  ngOnInit(): void {
      const token: any = localStorage.getItem("jwt");
      if (token && !this.jwtHelper.isTokenExpired(token)) {
        this.router.navigate(['/users']);
      }
  }


  login() {
    //console.log("Form data: ", this.loginUser);
    this.userService.Login(this.loginUser).subscribe(res => {
      //console.log(">> Login Result: ", res);
      const token = res.token;
      const user = JSON.stringify(res.user);

      localStorage.setItem("jwt", token);
      localStorage.setItem("user", user);

      notify("Login ok", 'success', 3000);
      this.router.navigate(['/users']);
    }, err => {
      notify("User name or password is wrong", 'error', 3000);
    })
  }
}
