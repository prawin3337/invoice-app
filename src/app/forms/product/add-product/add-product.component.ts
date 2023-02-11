import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService} from '../../../services/products.service';

import { LogValidationErrors } from '../../formUtils';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.less']
})
export class AddProductComponent implements OnInit {

    @Input() formStyle: string;
    @Input() showLabel: boolean;
    @Output() onFormSubmit = new EventEmitter();

    productForm: FormGroup;

    validationMessages = {
        proNm: {
          'required': 'Product name is required.'
        },
        proHsn: {
          'required': 'Product HSN is required.'
        },
        proDesc: {
            'required': 'Product description is required.'
        },
        proCat: {
            'required': 'Product category is required.'
        },
        proMake: {
            'required': 'Product make is required.'
        },
        proGst: {
            'required': 'Product GST required.',
            'max': 'Max GST is 99%.'
        },
        proStatus: {
            'required': 'Product status is required.'
        },
        proType: {
            'required': 'Product type is required.'
        }
    }
    
    formMessage = {
        proNm: '',
        proHsn: '',
        proDesc: '',
        proCat: '',
        proMake: '',
        proGst: '',
        proStatus: '',
        proType: '',
        insertError: '',
        successMessage: ''
    }

    constructor(private fb: FormBuilder, private productsService: ProductsService) { }

    ngOnInit(): void {
        // this.formStyle = "form-inline";
        // this.showLabel = true;

        this.buildProductForm();

        this.productForm.valueChanges.subscribe(value => {      
            this.logValidationErrors(this.productForm);
        });
    }

    buildProductForm(): void {
        this.productForm = this.fb.group({
            proNm: [''],
            proHsn: ['', [Validators.required]],
            proDesc: ['', [Validators.required]],
            proCat: [''],
            proMake: [''],
            proGst: ['', [Validators.required, Validators.min(0), Validators.max(99)]],
            proStatus: ['1', [Validators.required]],
            proType: [0, [Validators.required]]
        });
    }

    logValidationErrors(formGroup: FormGroup = this.productForm): void {
        const logValidationErrors = new LogValidationErrors(
                                        this.formMessage, this.validationMessages
                                    );
        
        ({formErrors: this.formMessage, validationMessages: this.validationMessages} 
            = logValidationErrors.validateFormControl(formGroup));
    }

    addProduct(): void {
        this.productsService.addProduct(this.productForm.value).subscribe((result) => {
            if(result) {
                this.formMessage.successMessage = result.message;
                this.onFormSubmit.emit({
                    result,
                    formObj: this.productForm
                })
                this.buildProductForm();
            }
        }, (error) => {
            console.error("Product error:", error);
            this.onFormSubmit.emit({
                error,
                formObj: this.productForm
            })
            this.formMessage.insertError = "Product was not added."
        });
    }
}
