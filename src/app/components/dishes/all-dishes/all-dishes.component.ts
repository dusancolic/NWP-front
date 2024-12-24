import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Router, RouterOutlet } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { NavigationComponent } from '../../navigation/navigation.component';
import { DishService } from '../../../service/dish.service';
import { DishDeleteModel, DishViewModel } from '../../../model/dish-model';
import { PermissionService } from '../../../service/permisions.service';


const HOME = '/home';

@Component({
  selector: 'app-all-dishes',
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
  templateUrl: './all-dishes.component.html',
  styleUrl: './all-dishes.component.css',
})
export class AllDishesComponent implements OnInit {

  pageIndex: number = 0;
  pageSize: number = 10;
  totalDishes: number = 0;
  displayedColumns: string[] = ['id', 'name', 'price','deleted', 'actions'];
  dataSource: MatTableDataSource<DishViewModel> = new MatTableDataSource<DishViewModel>([]);
  subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private dishService: DishService, private router: Router, private permissionService: PermissionService) { }

  ngOnInit(): void {
    const can_read = this.permissionService.hasPermission("can_read");
    if(can_read)
      this.getDishes();
    else
      this.getDishesFromMenu();
  }

  getDishes() {
    this.subscriptions.push(this.dishService.getDishes(this.pageIndex, this.pageSize).subscribe(res => {
      this.dataSource.data = res.content;
      this.totalDishes = res.totalElements;
      this.dataSource.sort = this.sort;
    }));
  }

  getDishesFromMenu(){
    this.subscriptions.push(this.dishService.getDishesFromMenu(this.pageIndex, this.pageSize).subscribe(res => {
      this.dataSource.data = res.content;
      this.totalDishes = res.totalElements;
      this.dataSource.sort = this.sort;
    }));
  }


  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getDishes();
  }

  canDelete(): Boolean {
    return this.permissionService.hasPermission('can_delete');
  }

  toggleDelete(dish: DishViewModel): void {

    const dishHelper : DishDeleteModel = {
      name: dish.name,
      deleted: dish.deleted
    };
    this.subscriptions.push(this.dishService.deleteDish(dishHelper).subscribe(
      (res: any) => {
        if (res) {
          this.getDishes();
        }
      },
      (error: any) => {
        console.log(`Error ${dish.deleted ? 'undeleting' : 'deleting'} dish:`, error);
      }
    ));

  }

  navigateToEditDish(dish: DishViewModel){
    this.router.navigate(['/edit-dish'], { state: { dish } });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }
}