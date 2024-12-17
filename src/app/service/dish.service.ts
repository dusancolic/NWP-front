import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UtilityService } from './utility.service';
import { PageableResponse } from '../pageable-response.model';
import { DishCreateModel, DishDeleteModel, DishEditModel, DishViewModel } from '../model/dish-model';

const DISHES = "/dishes";
const DELETE = "/delete";
const MENU = "/menu";

@Injectable({
  providedIn: 'root',
})
export class DishService {

  private url: string = environment.url;
  
  constructor(private http: HttpClient, private utilityService: UtilityService) { }

  getDishes(page:number, size:number): Observable<PageableResponse<DishViewModel[]>> {

    const headers = this.utilityService.getHeaders();
    return this.http.get<PageableResponse<DishViewModel[]>>(
      this.url + DISHES + `?page=${page}&size=${size}`, 
      { headers }
    );
  }

  getDishesFromMenu(page:number, size:number): Observable<PageableResponse<DishViewModel[]>> {

    const headers = this.utilityService.getHeaders();
    return this.http.get<PageableResponse<DishViewModel[]>>(
      this.url + DISHES + MENU + `?page=${page}&size=${size}`, 
      { headers }
    );
  }

  addDish(request: DishCreateModel) {
    const headers = this.utilityService.getHeaders();
    return this.http.post<DishViewModel>(
      this.url + DISHES, request,
      { headers }
    );
  }

  deleteDish(request: DishDeleteModel) {

    const headers = this.utilityService.getHeaders();
    request.deleted = !request.deleted;
    return this.http.put<DishViewModel>(
      this.url + DISHES + DELETE, request,
      { headers }
    );
    
  }

  editDish(request: DishEditModel) {
    const headers = this.utilityService.getHeaders();
    return this.http.put<DishViewModel>(
      this.url + DISHES, request,
      { headers }
    );
  }

  findDishByName(name: string) {
    const headers = this.utilityService.getHeaders();
    return this.http.get<DishViewModel>(
      this.url + DISHES + `/${name}`,
      { headers }
    );
  }

}