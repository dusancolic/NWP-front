export class DishViewModel {
    id : number;
    name : string;
    price : number;
    deleted: boolean;

    constructor(id: number, name: string, price: number, deleted: boolean) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.deleted = deleted;
    }
}

export class DishCreateModel {
    name: string;
    price: number;

    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }
}

export class DishEditModel {
    id: number;
    name: string;
    price: number;

    constructor(id: number, name: string, price: number) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

export class DishDeleteModel {
    name: string;
    deleted: boolean;

    constructor(name: string, deleted: boolean) {
        this.name = name;
        this.deleted = deleted;
    }
}
