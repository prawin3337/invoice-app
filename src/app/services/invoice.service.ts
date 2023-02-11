import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from "../../environments/environment";

interface Response {
  result: Array<any>
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  getInvoiceData(date: string) {
    const options = { params: {date} };
    return this.http.get<Response>(environment.apiPaths.invoices, options);
  }
}
