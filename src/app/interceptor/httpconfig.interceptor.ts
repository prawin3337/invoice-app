import { Injectable } from '@angular/core';
//import { ErrorDialogService } from '../error-dialog/errordialog.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    
  constructor(private router:Router,private auth:AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = localStorage.getItem('token');
    
        if (token) {
            request = request.clone({ headers: request.headers.set('token',token) });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);

                    if(event.headers.get('Is-Logged-In') === 'false') {
                      console.log(event.headers.get('Is-Logged-In'));
                      this.router.navigate(['/login']);
                      //this.auth.setLoggedIn(false);
                    }
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                  console.error(error);
                  let data = {};
                  data = {
                      reason: error && error.error.reason ? error.error.reason : '',
                      status: error.status
                  };
                  
                  if(error.status == 401) {
                        this.router.navigate(['/login']);
                  }
                  //this.errorDialogService.openDialog(data);
                  return throwError(data);
              }));
    }


}