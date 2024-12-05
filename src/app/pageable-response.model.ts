export interface PageableResponse<T> {
    content: T;
    pageable: any; 
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: any; 
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}