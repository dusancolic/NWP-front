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
    console.log("set perm");
    console.log(userPermissions);
    console.log(this.userPermissions);
  }

  hasPermission(permission: keyof PermissionModel['permissions']): boolean {
    console.log("has perm");
    console.log(this.userPermissions);
    const storedPermissions = localStorage.getItem("permissions");
    if(storedPermissions)
      this.userPermissions = JSON.parse(storedPermissions);
    return this.userPermissions?.permissions[permission] ?? false;
  }

}