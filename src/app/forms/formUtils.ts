import { FormGroup, FormArray, FormControl } from '@angular/forms';

export class LogValidationErrors {
    formErrors = {};
    validationMessages = {};

    constructor(formErrors: any, validationMessages: any) {
        this.formErrors = formErrors;
        this.validationMessages = validationMessages;
    }

    validateFormControl(formGroup: FormGroup): any {
        Object.keys(formGroup.controls).forEach((key: string) => {
            const abstractControl = formGroup.get(key);
            this.formErrors[key] = [];

            if(abstractControl instanceof FormGroup) {
                this.validateFormControl(abstractControl);
            } if(abstractControl instanceof FormArray) {
                abstractControl.controls.forEach(element => {
                    this.validateFormControl(<FormGroup>element);
                });
            } else {
                if(abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
                    let messages = this.validationMessages[key];
                    for(const errorKey in abstractControl.errors) {
                        if(errorKey) {
                            this.formErrors[key] += messages[errorKey] + ' ';
                        }
                    }
                }
            }
        });

        return {formErrors: this.formErrors, validationMessages: this.validationMessages}
    }
}

export function positiveNumber(control: FormControl): { [key: string]: any; } {
    if (Number(control.value) < 1) {
      return {positiveNumber: true};
    } else {
      return null;
    }
}

export function nigativeNumber(control: FormControl): { [key: string]: any; } {
    if (Number(control.value) < 0) {
      return {nigativeNumber: true};
    } else {
      return null;
    }
}

export function calculateGst(gstPercentage: number, qty: number, rate: number) {
    const total = qty*rate;
    const gstAmt = ((total/100)*gstPercentage);
    const totalWithGst = (total+gstAmt).toFixed(2);
    return({total, gstAmt, totalWithGst});
}

export function isValidListItem(list: any[], key: any, inputValue: any) {
    if(list.some((obj) => obj[key] == inputValue)) {
        return null;
    } else {
        return {notFromList: true}
    }
}