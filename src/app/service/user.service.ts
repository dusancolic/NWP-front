import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UtilityService } from './utility.service';
import { UserViewModel, LoginViewModel, UserCreateModel, UserDeleteModel, UserEditModel } from '../model/user-model';
import { PageableResponse } from '../pageable-response.model';

const LOGIN = "/auth/login";
const USER = "/users";
const DELETE = "/delete";

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private url: string = environment.url;
  
  constructor(private http: HttpClient, private utilityService: UtilityService) { }

  getUsers(page:number, size:number): Observable<PageableResponse<UserViewModel[]>> {

    const headers = this.utilityService.getHeaders();
    return this.http.get<PageableResponse<UserViewModel[]>>(
      this.url + USER + `?page=${page}&size=${size}`, 
      { headers }
    );
  }


  addUser(request: UserCreateModel) {
    const headers = this.utilityService.getHeaders();
    return this.http.post<UserViewModel>(
      this.url + USER, request,
      { headers }
    );
  }

  deleteUser(request: UserDeleteModel) {

    const headers = this.utilityService.getHeaders();
    request.deleted = !request.deleted;
    return this.http.put<UserViewModel>(
      this.url + USER + DELETE, request,
      { headers }
    );
    
  }

  editUser(request: UserEditModel) {
    const headers = this.utilityService.getHeaders();
    return this.http.put<UserViewModel>(
      this.url + USER, request,
      { headers }
    );
  }

  findUserByUsername(username: string) {
    const headers = this.utilityService.getHeaders();
    return this.http.get<UserViewModel>(
      this.url + USER + `/${username}`,
      { headers }
    );
  }

  login(request: LoginViewModel) {
    return this.http.post<UserViewModel>(
      this.url + LOGIN, request
    )
  }
}