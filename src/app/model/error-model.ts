export class ErrorViewModel {
    id: number;
    order: string;
    message: string;
    username: string;
    time: Date;
    operation: string;

    constructor(id: number, order: string, message: string, username: string, time: Date, operation: string) {
        this.id = id;
        this.order = order;
        this.message = message;
        this.username = username;
        this.time = time;
        this.operation = operation;
    }
}