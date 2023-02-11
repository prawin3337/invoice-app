import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute, Router } from '@angular/router';

import { LogValidationErrors } from '../../forms/formUtils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    returnUrl: string;

    validationMessages = {
        loginId: {
        'required': 'Login Id is required.'
        },
        password: {
        'required': 'Password is required.'
        }
    }

    formErrors = {
        loginId: '',
        password: '',
        loginError: ''
    }

    constructor(private fb: FormBuilder, 
                private authService: AuthService, 
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit(): void {
        // reset login status
        this.authService.setLoggedIn(false);

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        this.buildLoginForm();

        this.loginForm.valueChanges.subscribe(value => {      
        this.logValidationErrors(this.loginForm);
        });
    }

    buildLoginForm(): void {
        this.loginForm = this.fb.group({
        loginId: ['', [Validators.required]],
        password: ['', [Validators.required]]
        });
    }

    login(): void {
        this.authService.login(this.loginForm.value).subscribe((res) => {
            if(res.status && res.data.length) {
                let sessionData = res.data[0];

                this.formErrors["loginError"] = "";
                this.authService.setLoggedIn(true, sessionData.token);

                // TODO: 
                // this.router.navigateByUrl(this.returnUrl);

                // Use sessionData->userData only for php dependancy.
                this.router.navigate(['/home', {sessionData: JSON.stringify(sessionData)}]);
            } else {
                this.formErrors["loginError"] = res.message;
                this.authService.setLoggedIn(true, "");
            }
        });
    }

    logValidationErrors(formGroup: FormGroup = this.loginForm): void {

        const logValidationErrors = new LogValidationErrors(
            this.formErrors, this.validationMessages
        );

        ({formErrors: this.formErrors, validationMessages: this.validationMessages} 
        = logValidationErrors.validateFormControl(formGroup));
    }
}
