import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient) { }

  getAddress() {
      return this.http.get<Response>(environment.apiPaths.getAddress);
  }

  addAddress(data: any): Observable<any> {
      return this.http.post<any>(environment.apiPaths.addAddress, data);
  }
}
