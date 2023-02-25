import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { UserApiService } from '../services/user-api.service';
import {map} from 'rxjs/operators'
import { formatDate } from 'devextreme/localization';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userId: any;
  loadedOrders: any;
  fromDate: any;
  toDate: any;
  loggedUserStr: any;
  loggedUser: any;
  orderSum = 0;
  constructor(private route: ActivatedRoute, private userService: UserApiService) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];
    this.loggedUserStr = localStorage.getItem("user");
    this.loggedUser = JSON.parse(this.loggedUserStr);
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
        console.log("Result: ", res);
        this.loadedOrders = res;
        for (let x in res) {
          console.log(res[x]);
          this.orderSum += res[x].totalPrice;
        }
      }, err => {
        notify("Error with summaring orders", 'error', 3000);
      })
    }
  }

  GetOrders() {
    this.userService.GetOrders(this.userId)
      .pipe(
        map((res: any) => res.map((item: any) => {
          let obj = {
            id: item.id,
            date: formatDate(new Date(item.date), 'dd/MM/yyyy'),
            totalPrice: item.totalPrice,
          }
          return obj
        }))
      )
      .subscribe(res => {
        this.loadedOrders = res;
        this.orderSum = 0;
        //console.log("User orders: ", this.loadedOrders);
      }, err => {
        notify("Error with user loading", 'error', 3000);
      })
  }
}
