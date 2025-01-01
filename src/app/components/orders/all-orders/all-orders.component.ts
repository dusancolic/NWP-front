import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

import { Router, RouterOutlet } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NavigationComponent } from '../../navigation/navigation.component';
import { OrderEditModel, OrderSearchModel, OrderViewModel } from '../../../model/order-model';
import { OrderService } from '../../../service/order.service';
import { PermissionService } from '../../../service/permisions.service';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

const HOME = '/home';

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatPaginatorModule,
    MatSortModule,
    NavigationComponent,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css'],
  providers: [DatePipe]
})
export class AllOrdersComponent implements OnInit, OnDestroy {
  fromDate: Date = new Date();
  toDate: Date = new Date();
  orderedBy: string = '';
  pageIndex: number = 0;
  pageSize: number = 10;
  totalOrders: number = 0;
  selectedOrderStatuses: string[] = [];
  orderStatuses: string[] = ["ORDERED", "PREPARING", "IN_DELIVERY", "DELIVERED", "CANCELED", "SCHEDULED"];
  request: OrderSearchModel = new OrderSearchModel(null, null, null, null);
  displayedColumns: string[] = ['id', 'orderedBy', "dishes", 'orderStatus', 'orderedAt', 'active', 'actions'];
  dataSource: MatTableDataSource<OrderViewModel> = new MatTableDataSource<OrderViewModel>([]);
  subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  orderDoesntExist: boolean = false;
  ordersSearchForm!: FormGroup;
  stompClient: Stomp.Client | null = null;
  isWebSocketConnected: boolean = false;

  constructor(private fb: FormBuilder, private datePipe: DatePipe, private orderService: OrderService, private router: Router, private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.getOrders();
    this.ordersSearchForm = this.fb.group({
      orderedBy: [null],
      orderStatuses: [null],
      fromDate: [null],
      toDate: [null]
    });
    if(this.canTrack()){
      this.onConnect(() => {
        console.log("connected");
        this.sendMessage();
      });
  }
  }

  getOrders() {
    this.subscriptions.push(this.orderService.getOrders(this.pageIndex, this.pageSize, this.request).subscribe(res => {
      this.dataSource.data = res.content;
      this.totalOrders = res.totalElements;
      this.dataSource.sort = this.sort;
      this.orderDoesntExist = this.dataSource.data.length === 0;
    }));
  }

  onConnect(callback: () => void) {
    const token = localStorage.getItem('token');
    const socket = new SockJS(`http://localhost:8080/ws?jwt=${token}`);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      this.isWebSocketConnected = true;
      this.stompClient?.subscribe('/topic/orders', (message) => {
        console.log("message ", message);
        this.getOrders();
      });
      callback();
    });
  }

  sendMessage() {
    if (this.stompClient && this.isWebSocketConnected) {
      this.stompClient.send("/app/send-message", {}, JSON.stringify({'id': 1, 'status': "IN_DELIVERY"}));
    } else {
      console.error('WebSocket connection is not established yet.');
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getOrders();
  }

  canCancel(order: OrderViewModel): Boolean {
    return this.permissionService.hasPermission('can_cancel_order') && (order.orderStatus.toLowerCase() === 'ordered' || order.orderStatus.toLowerCase() === 'scheduled'
      && order.active);
  }

  canTrack(): Boolean {
    return this.permissionService.hasPermission('can_track_order');
  }

  isAdmin(): Boolean {
    const admin = localStorage.getItem('admin');
    return admin !== null && admin === "true";
  }

  toggleEdit(order: OrderViewModel): void {
    const orderHelper: OrderEditModel = {
      id: order.id,
      orderStatus: "CANCELED",
    };
    this.subscriptions.push(this.orderService.editOrder(orderHelper).subscribe(
      (res: any) => {
        if (res) {
          this.getOrders();
        }
      },
      (error: any) => {
        console.log(`Error canceling order:`, error);
      }
    ));
  }

  toggleOrderStatusSelection(orderStatus: string): void {
    if (this.selectedOrderStatuses.includes(orderStatus)) {
      this.selectedOrderStatuses = this.selectedOrderStatuses.filter(o => o !== orderStatus);
    } else {
      this.selectedOrderStatuses.push(orderStatus);
    }
  }

  onSearch() {
    this.request.from = this.ordersSearchForm.get('fromDate')?.value;
    this.request.to = this.ordersSearchForm.get('toDate')?.value;
    this.request.username = this.ordersSearchForm.get('orderedBy')?.value === "" ? null : this.ordersSearchForm.get('orderedBy')?.value;
    this.request.statuses = this.selectedOrderStatuses.length > 0 ? this.selectedOrderStatuses : null;
    this.getOrders();
  }

  onReset(): void {
    this.ordersSearchForm.reset();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }
}
