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
    can_search_order: boolean;
    can_place_order: boolean;
    can_cancel_order: boolean;
    can_track_order: boolean;
    can_schedule_order: boolean;
    admin: boolean;
    token: string = "";
    deleted: boolean;

    constructor(id: number, firstname: string, lastname: string, username: string, password: string, can_create: boolean, can_read: boolean, can_delete: boolean, can_update: boolean,
        can_search_order: boolean, can_place_order: boolean, can_cancel_order: boolean, can_track_order: boolean, can_schedule_order: boolean, deleted: boolean, admin: boolean) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.password = password;
        this.can_create = can_create;
        this.can_read = can_read;
        this.can_delete = can_delete;
        this.can_update = can_update;
        this.can_search_order = can_search_order;
        this.can_place_order = can_place_order;
        this.can_cancel_order = can_cancel_order;
        this.can_track_order = can_track_order;
        this.can_schedule_order = can_schedule_order;
        this.deleted = deleted;
        this.admin = admin;
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

    can_search_order: boolean;
    can_place_order: boolean;
    can_cancel_order: boolean;
    can_track_order: boolean;
    can_schedule_order: boolean;

    constructor(firstname: string, lastname: string, username: string, password: string, can_create: boolean, can_read: boolean, can_delete: boolean, can_update: boolean,
        can_search_order: boolean, can_place_order: boolean, can_cancel_order: boolean, can_track_order: boolean, can_schedule_order: boolean
    ) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.password = password;
        this.can_create = can_create;
        this.can_read = can_read;
        this.can_delete = can_delete;
        this.can_update = can_update;
        this.can_search_order = can_search_order;
        this.can_place_order = can_place_order;
        this.can_cancel_order = can_cancel_order;
        this.can_track_order = can_track_order;
        this.can_schedule_order = can_schedule_order;
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
    can_search_order: boolean;
    can_place_order: boolean;
    can_cancel_order: boolean;
    can_track_order: boolean;
    can_schedule_order: boolean;

    constructor(id: number, firstname: string, lastname: string, username: string, can_create: boolean, can_read: boolean, can_delete: boolean, can_update: boolean,
        can_search_order: boolean, can_place_order: boolean, can_cancel_order: boolean, can_track_order: boolean, can_schedule_order: boolean
    ) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.can_create = can_create;
        this.can_read = can_read;
        this.can_delete = can_delete;
        this.can_update = can_update;
        this.can_search_order = can_search_order;
        this.can_place_order = can_place_order;
        this.can_cancel_order = can_cancel_order;
        this.can_track_order = can_track_order;
        this.can_schedule_order = can_schedule_order;
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
        can_search_order: boolean;
        can_place_order: boolean;
        can_cancel_order: boolean;
        can_track_order: boolean;
        can_schedule_order: boolean;
    };
    
    constructor(can_create: boolean, can_read: boolean, can_update: boolean, can_delete: boolean, can_search_order: boolean, can_place_order: boolean, can_cancel_order: boolean, can_track_order: boolean, can_schedule_order: boolean) {
        this.permissions = { can_create, can_read, can_update, can_delete, can_search_order, can_place_order, can_cancel_order, can_track_order, can_schedule_order };
    }
    
}