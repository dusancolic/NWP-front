import { DishViewModel } from "./dish-model";
import { UserViewModel } from "./user-model";

export class OrderViewModel{
    id: number;
    orderedBy: UserViewModel;
    orderStatus: string;
    active: boolean;
    orderedAt: Date;
    dishes: String;

    constructor(id: number, orderedBy: UserViewModel, orderStatus: string, active: boolean, orderedAt: Date, dishes: String){
        this.id = id;
        this.orderedBy = orderedBy;
        this.orderStatus = orderStatus;
        this.active = active;
        this.orderedAt = orderedAt;
        this.dishes = dishes;
    }
}

export class OrderSearchModel{
    from: Date | null;
    to: Date | null;
    username: string | null;
    statuses: string[] | null;

    constructor(from: Date | null, to: Date | null, username: string | null, statuses: string[] | null){
        this.from = from;
        this.to = to;
        this.username = username;
        this.statuses = statuses;
    }
}

export class OrderCreateModel{
    dishes: DishViewModel[];

    constructor(dishes: DishViewModel[]){
        this.dishes = dishes;
    }
}

export class OrderScheduleModel{
    dishes: DishViewModel[];
    scheduledFor: Date;
    constructor(dishes: DishViewModel[], scheduledFor: Date){
        this.dishes = dishes;
        this.scheduledFor = scheduledFor;
    }
}



export class OrderEditModel{
    id: number;
    orderStatus: string;

    constructor(id: number,orderStatus: string){
        this.id = id;
        this.orderStatus = orderStatus;
    }
}