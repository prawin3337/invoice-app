import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { productObj } from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

    constructor(private http: HttpClient) { }

    addProduct(data: productObj): Observable<any> {
        return this.http.post<any>(environment.apiPaths.addProduct, data);
    }

    getProduct() {
        return this.http.get<Response>(environment.apiPaths.getProduct);
    }
}
