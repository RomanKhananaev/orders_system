import { Component, OnInit } from '@angular/core';
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
  constructor(private userService: UserApiService) { }

  ngOnInit(): void {
    this.userService.GetUsersByRole(1).subscribe(res => {
      this.userList = res;
    })
  }

  debug(e: any) {
    this.userService.GetUsersByRole(e.itemData.id).subscribe(res => {
      this.userList = res;
    })
  }
}
