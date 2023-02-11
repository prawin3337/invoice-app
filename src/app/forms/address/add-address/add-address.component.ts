import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LogValidationErrors } from '../../formUtils';
import { AddressService } from '../../../services/address.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.less']
})
export class AddAddressComponent implements OnInit {

  @Output() onFormSubmit = new EventEmitter();

  addressForm: FormGroup;
  formMessage = {
      addressDet: "",
      insertError: "",
      successMessage: ""
  }

  validationMessages = {
    addressDet: {
      'required': 'Address is required.'
    }
  }

  constructor(private fb: FormBuilder, private AddressService: AddressService) {}

  ngOnInit(): void {
      this.buildProductForm();
  }

  buildProductForm(): void {
      this.addressForm = this.fb.group({
          addressDet: ["", [Validators.required]],
          addressContact: [""],
          state: [""],
          stateCode: [""]
      });
  }

  logValidationErrors(formGroup: FormGroup = this.addressForm): void {
      const logValidationErrors = new LogValidationErrors(
          this.formMessage, this.validationMessages
      );

      ({formErrors: this.formMessage, validationMessages: this.validationMessages} 
          = logValidationErrors.validateFormControl(formGroup));
  }

  addAddress(): void {
    this.AddressService.addAddress(this.addressForm.value).subscribe((result) => {
        if(result) {
            this.formMessage.successMessage = result.message;
            this.onFormSubmit.emit({
                result,
                formObj: this.addressForm
            });
            this.buildProductForm();
        }
    }, (error) => {
        console.error("Product error:", error);
        this.onFormSubmit.emit({
          error,
          formObj: this.addressForm
      });
        this.formMessage.insertError = "Address was not added."
    });
  }

}
