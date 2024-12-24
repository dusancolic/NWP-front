import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

import { Router, RouterOutlet } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { NavigationComponent } from '../navigation/navigation.component';
import { OrderEditModel, OrderSearchModel, OrderViewModel } from '../../model/order-model';
import { PermissionService } from '../../service/permisions.service';
import { OrderService } from '../../service/order.service';


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
    MatButtonModule
  ],
  
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.css',
  providers: [DatePipe]
})
export class AllOrdersComponent implements OnInit {

  pageIndex: number = 0;
  pageSize: number = 10;
  totalOrders: number = 0;
  request: OrderSearchModel = new OrderSearchModel(null, null, null, null);
  displayedColumns: string[] = ['id', 'orderedBy', "dishes", 'orderStatus', 'orderedAt', 'active', 'actions'];
  dataSource: MatTableDataSource<OrderViewModel> = new MatTableDataSource<OrderViewModel>([]);
  subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private datePipe: DatePipe, private orderService: OrderService, private router: Router, private permissionService: PermissionService) { }

  ngOnInit(): void {
    const can_read = this.permissionService.hasPermission("can_read");
    this.getOrders();
  }

  getOrders() {
    this.subscriptions.push(this.orderService.getOrders(this.pageIndex, this.pageSize, this.request).subscribe(res => {
      this.dataSource.data = res.content;
      this.totalOrders = res.totalElements;
      this.dataSource.sort = this.sort;
    }));
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

  toggleEdit(order: OrderViewModel): void {

    const orderHelper : OrderEditModel = {
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }
}