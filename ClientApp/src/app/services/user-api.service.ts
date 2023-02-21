import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  readonly APIUrl = "/api";
  constructor(private http: HttpClient) { }

  Login(loginForm: any) {
    return this.http.post<any>(this.APIUrl + '/users/Login',loginForm);
  }
  GetUsersByRole(roleId: number) {
    return this.http.post<any>(this.APIUrl + `/users/GetUsersByRole/${roleId}`, {});
  }
}
