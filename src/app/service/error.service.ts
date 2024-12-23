import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UtilityService } from './utility.service';
import { PageableResponse } from '../pageable-response.model';
import { ErrorViewModel } from '../model/error-model';

const ERRORS = "/errors";


@Injectable({
  providedIn: 'root',
})
export class ErrorService {

  private url: string = environment.url;
  
  constructor(private http: HttpClient, private utilityService: UtilityService) { }

  getErrors(page:number, size:number): Observable<PageableResponse<ErrorViewModel[]>> {

    const headers = this.utilityService.getHeaders();
    return this.http.get<PageableResponse<ErrorViewModel[]>>(
      this.url + ERRORS + `?page=${page}&size=${size}`, 
      { headers }
    );
  }

}