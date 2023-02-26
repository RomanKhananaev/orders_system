import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { UserApiService } from '../services/user-api.service';
import { map } from 'rxjs/operators'
import { formatDate } from 'devextreme/localization';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  selectedUser: any;
  userId: any;
  loadedOrders: any;
  presentOrders: any;
  fromDate: any;
  toDate: any;

  orderSum = 0;
  constructor(private route: ActivatedRoute, private userService: UserApiService, private router: Router) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];
    this.selectedUser = localStorage.getItem("selectedUser");
    if (this.selectedUser == "null") {
      this.router.navigate(['/users']);
    }
    this.selectedUser = JSON.parse(this.selectedUser);
    localStorage.setItem("selectedUser", "null");

    this.userService.GetOrders(this.userId)
      .pipe(
        map((res: any) => res.map((item: any) => {
          let obj = {
            id: item.id,
            date: new Date(item.date),
            totalPrice: item.totalPrice,
            description: item.description
          }
          obj.date.setTime(obj.date.getTime() + 2 * 60 * 60 * 1000)
          return obj
        }))
      )
      .subscribe(res => {
        this.loadedOrders = res;
        this.presentOrders = res;
        this.orderSum = 0;
        //console.log("User orders: ", this.loadedOrders);
      }, err => {
        notify("Error with orders loading", 'error', 3000);
      })
  }

  GetOrderSum() {
    //console.log("Start: " + this.fromDate + ", End: " + this.toDate);
    if (this.fromDate > this.toDate) {
      notify("'To date' cannot be before 'From date'", 'error', 3000);
    }
    else if (this.fromDate == null || this.toDate == null) {
      notify("Please select 'From' and 'To' dates to get orders sum", 'error', 3000);
    }
    else {
      let OrderSumObj = {
        userId: this.userId,
        from: this.fromDate,
        to: this.toDate,
      }
      this.userService.GetOrdersSum(OrderSumObj).subscribe(res => {
        //console.log("Result: ", res);
        this.orderSum = res;
        this.presentOrders = this.loadedOrders.filter((x: any) => x.date.getTime() >= Date.parse(this.fromDate) && x.date.getTime() <= Date.parse(this.toDate))
        //console.log("Present: ", this.presentOrders)
      }, err => {
        notify("Error with summaring orders", 'error', 3000);
      })
    }
  }
  ClearFilter() {
    this.presentOrders = this.loadedOrders;
  }

}
