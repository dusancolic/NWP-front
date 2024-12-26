import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { from, Subscription } from 'rxjs';

import { Router, RouterOutlet } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { NavigationComponent } from '../navigation/navigation.component';
import { OrderEditModel, OrderSearchModel, OrderViewModel } from '../../model/order-model';
import { PermissionService } from '../../service/permisions.service';
import { OrderService } from '../../service/order.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


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
  styleUrl: './all-orders.component.css',
  providers: [DatePipe]
})
export class AllOrdersComponent implements OnInit {

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

  constructor(private fb: FormBuilder, private datePipe: DatePipe, private orderService: OrderService, private router: Router, private permissionService: PermissionService) { }

  ngOnInit(): void {
    this.getOrders();
    this.ordersSearchForm = this.fb.group({
      orderedBy: [null],
      orderStatuses: [null],
      fromDate: [null],
      toDate: [null]
    });
  }


  getOrders() {
    this.subscriptions.push(this.orderService.getOrders(this.pageIndex, this.pageSize, this.request).subscribe(res => {
      this.dataSource.data = res.content;
      this.totalOrders = res.totalElements;
      this.dataSource.sort = this.sort;
    }));
    if(this.dataSource.data.length == 0){
      this.orderDoesntExist = true;
    }
    else{
      this.orderDoesntExist = false;
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getOrders();
  }

  canCancel(order: OrderViewModel): Boolean {
    return this.permissionService.hasPermission('can_cancel_order') && (order.orderStatus.toLowerCase() == 'ordered' || order.orderStatus.toLowerCase() == 'scheduled'
      && order.active);
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
    }
    else {
      this.selectedOrderStatuses.push(orderStatus);
    }

  }

  onSearch() {
    this.request.from = this.ordersSearchForm.get('fromDate')?.value;
    this.request.to = this.ordersSearchForm.get('toDate')?.value;
    this.request.username = this.ordersSearchForm.get('orderedBy')?.value == "" ? null : this.ordersSearchForm.get('orderedBy')?.value;
    this.request.statuses = this.selectedOrderStatuses.length > 0 ? this.selectedOrderStatuses : null;
    this.getOrders();
  }

  onReset(): void {
    this.ordersSearchForm.reset();
    this.orderDoesntExist = false;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }
}