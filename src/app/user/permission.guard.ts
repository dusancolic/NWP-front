import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionService } from '../service/permisions.service';
import { PermissionModel } from '../model/user-model';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

    constructor(private permissionService: PermissionService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
      const requiredPermissions = route.data['permissions'] as (keyof PermissionModel['permissions'])[];
  
      console.log(requiredPermissions);
      
      const hasAllPermissions = requiredPermissions.every(permission =>
        this.permissionService.hasPermission(permission)
      
      );
    
      if (hasAllPermissions) 
        return true;
      if(!this.permissionService.hasPermission('can_place_order'))
        this.router.navigate(['/without-read']);
      else if(!this.permissionService.hasPermission('can_read'))
        this.router.navigate(['/create-order']);
      else
        this.router.navigate(['/users']);
      return false;
    }


}
