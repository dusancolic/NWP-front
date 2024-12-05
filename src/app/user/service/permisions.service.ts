import { Injectable } from '@angular/core';
import { PermissionModel } from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private userPremissions: PermissionModel | null = null;

  constructor() {}


  setUserPermissions(userPremissions: PermissionModel) {
    this.userPremissions = userPremissions;
    console.log("set perm");
    console.log(userPremissions);
    console.log(this.userPremissions);
  }

  hasPermission(permission: keyof PermissionModel['permissions']): boolean {
    console.log("has perm");
    console.log(this.userPremissions);
    return this.userPremissions?.permissions[permission] ?? false;
  }

}