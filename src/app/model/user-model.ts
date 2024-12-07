export class UserViewModel {
    id : number;
    firstname : string;
    lastname : string;
    username : string;
    password : string;
    can_create: boolean;
    can_read: boolean;
    can_delete: boolean;
    can_update: boolean;
    token: string = "";
    deleted: boolean;

    constructor(id: number, firstname: string, lastname: string, username: string, password: string, can_create: boolean, can_read: boolean, can_delete: boolean, can_update: boolean, deleted: boolean) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.password = password;
        this.can_create = can_create;
        this.can_read = can_read;
        this.can_delete = can_delete;
        this.can_update = can_update;
        this.deleted = deleted;
    }
}

export class UserCreateModel {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    can_create: boolean;
    can_read: boolean;
    can_delete: boolean;
    can_update: boolean;

    constructor(firstname: string, lastname: string, username: string, password: string, can_create: boolean, can_read: boolean, can_delete: boolean, can_update: boolean) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.password = password;
        this.can_create = can_create;
        this.can_read = can_read;
        this.can_delete = can_delete;
        this.can_update = can_update;
    }
}

export class UserEditModel {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    can_create: boolean;
    can_read: boolean;
    can_delete: boolean;
    can_update: boolean;

    constructor(id: number, firstname: string, lastname: string, username: string, can_create: boolean, can_read: boolean, can_delete: boolean, can_update: boolean) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.can_create = can_create;
        this.can_read = can_read;
        this.can_delete = can_delete;
        this.can_update = can_update;
    }
}

export class UserDeleteModel {
    username: string;
    deleted: boolean;

    constructor(username: string, deleted: boolean) {
        this.username = username;
        this.deleted = deleted;
    }
}

export interface LoginViewModel {
    username : string;
    password : string;
}

export class PermissionModel{
    permissions : {
        can_create: boolean;
        can_read: boolean;
        can_delete: boolean;
        can_update: boolean;
    };
    
    constructor(can_create: boolean, can_read: boolean, can_update: boolean, can_delete: boolean) {
        this.permissions = { can_create, can_read, can_update, can_delete };
    }
    
}