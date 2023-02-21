import { Component, OnInit } from '@angular/core';
import { UserApiService } from '../services/user-api.service';
import notify from 'devextreme/ui/notify'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginUser = {
    userName: 'rom',
    password: '15423562'
  }
  data: any;
  constructor(
    private userService: UserApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.GetUsersByRole(1).subscribe(res => {
      console.log("Users with role '1':", res);
    })
  }


  login() {
    console.log("Form data: ", this.loginUser);
    this.userService.Login(this.loginUser).subscribe(res => {
      console.log(">> Login Result: ", res);
      notify("Login ok", 'success', 3000);
      this.router.navigate(['/users']);
    }, err => {
      notify("User name or password is wrong", 'error', 3000);
    })
  }
}
