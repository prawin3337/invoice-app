import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface loginObj {
  loginId: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    loggedInStatus: boolean = false;

    constructor(private http: HttpClient) {}

    login(obj: loginObj) {
        return this.http.post<any>(environment.apiPaths.login,obj);
    }

    get isLoggedIn(): boolean {
        if(localStorage.getItem('token')) {
            this.loggedInStatus = true;
            return this.loggedInStatus;
        } else {
            this.setLoggedIn(false);
        }
    }

    setLoggedIn(value: boolean, token: string = ""): void {
        this.loggedInStatus = value;

        if(this.loggedInStatus) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem("token");
        }
    }
}
