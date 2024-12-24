import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

import { Router, RouterOutlet } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { PermissionService } from '../../service/permisions.service';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { ErrorViewModel } from '../../model/error-model';
import { ErrorService } from '../../service/error.service';


const HOME = '/home';

@Component({
  selector: 'app-all-errors',
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
  templateUrl: './all-errors.component.html',
  styleUrl: './all-errors.component.css',
  providers: [DatePipe]
})
export class AllErrorsComponent implements OnInit {

  pageIndex: number = 0;
  pageSize: number = 10;
  totalErrors: number = 0;
  displayedColumns: string[] = ['id', 'order', 'message','username', 'time', 'operation'];
  dataSource: MatTableDataSource<ErrorViewModel> = new MatTableDataSource<ErrorViewModel>([]);
  subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private datePipe: DatePipe, private errorService: ErrorService, private router: Router, private permissionService: PermissionService) { }

  ngOnInit(): void {
    this.getErrors();
  }

  getErrors() {
    this.subscriptions.push(this.errorService.getErrors(this.pageIndex, this.pageSize).subscribe(res => {
      this.dataSource.data = res.content;
      this.totalErrors = res.totalElements;
      this.dataSource.sort = this.sort;
    }));
  }


  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getErrors();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }
}