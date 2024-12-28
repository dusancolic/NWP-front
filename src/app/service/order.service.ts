import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UtilityService } from './utility.service';
import { PageableResponse } from '../pageable-response.model';
import { OrderCreateModel, OrderEditModel, OrderScheduleModel, OrderSearchModel, OrderViewModel } from '../model/order-model';

const ORDERS = "/orders";
const SEARCH = "/search";
const SCHEDULE = "/schedule";

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private url: string = environment.url;
  
  constructor(private http: HttpClient, private utilityService: UtilityService) { }

  getOrders(page:number, size:number, request: OrderSearchModel): Observable<PageableResponse<OrderViewModel[]>> {

    const headers = this.utilityService.getHeaders();
    return this.http.post<PageableResponse<OrderViewModel[]>>(
      this.url + ORDERS + SEARCH + `?page=${page}&size=${size}`, request,
      { headers }
    );
  }

  addOrder(request: OrderCreateModel) {
    const headers = this.utilityService.getHeaders();
    return this.http.post<OrderViewModel>(
      this.url + ORDERS, request,
      { headers }
    );
  }

  scheduleOrder(request: OrderScheduleModel) {
    const headers = this.utilityService.getHeaders();
    return this.http.post<OrderViewModel>(
      this.url + ORDERS + SCHEDULE, request,
      { headers }
    );
  }

  editOrder(request: OrderEditModel) {
    const headers = this.utilityService.getHeaders();
    return this.http.put<OrderViewModel>(
      this.url + ORDERS, request,
      { headers }
    );
  }

}