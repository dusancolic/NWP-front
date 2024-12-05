import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  constructor() {}

  getHeaders(): HttpHeaders {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') || localStorage.getItem('token') || '' : '';
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return headers;
  }
}
