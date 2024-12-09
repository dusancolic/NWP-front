import { Injectable } from '@angular/core';
import { PermissionModel } from '../model/user-model';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private userPermissions: PermissionModel | null = null;

  constructor() {}


  setUserPermissions(userPermissions: PermissionModel) {
    this.userPermissions = userPermissions;
    localStorage.setItem("permissions", JSON.stringify(userPermissions));
  }

  hasPermission(permission: keyof PermissionModel['permissions']): boolean {
    const storedPermissions = localStorage.getItem("permissions");
    if(storedPermissions)
      this.userPermissions = JSON.parse(storedPermissions);
    return this.userPermissions?.permissions[permission] ?? false;
  }

}