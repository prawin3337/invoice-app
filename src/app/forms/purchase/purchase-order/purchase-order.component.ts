import { Component, OnInit, TemplateRef} from '@angular/core';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';

import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import {ProductsService} from "../../../services/products.service";
import {VendorsService} from "../../../services/vendors.service";
import { AddressService } from 'src/app/services/address.service';
import {PurchaseOrderService} from '../../../services/purchase-order.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { from } from 'rxjs';
import { LogValidationErrors,
         positiveNumber,
         nigativeNumber,
         calculateGst,
         isValidListItem } from '../../formUtils';


@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.less']
})
export class PurchaseOrderComponent implements OnInit {

  bsModalRef: BsModalRef;

  poForm: FormGroup;
  selectedValue: string;

  products: any[] = [];
  vendors: any[] = [];
  addressList: any[] = [];
  grandTotal: number = 0;
  private _addProductRow: number = -1;

  validationMessages = {
      poNo: {},
      deliveryDate: {
        'required': 'Delivery Date is required.'
      },
      requestedBy: {
        'required': 'Requested By is required.'
      },
      approvedBy: {
        'required': 'Approved By is required.'
      },
      deliveryAddressDetails: {
        'required': 'Delivery address is required.'
      },
      deliveryAddress: {
        'required': 'Delivery address is required.',
        'notFromList': 'Select the address from a list.'
      },
      venNm: {
        'required': 'Vendor name is required.',
        'notFromList': 'Select the vendor from a list.'
      },
      proHsn: {
        'required': 'Product HSN is required.'
      },
      proDesc: {
          'required': 'Product description is required.',
          'notFromList': 'Select the product from a list.'
      },
      proQty: {
          'required': 'Quantity is required.',
          'positiveNumber': 'Should not be less than 1.'
      },
      proGst: {
        'required': 'GST is required.',
        'nigativeNumber': 'Should not be a nigative number.'
      },
      proRate: {
        'required': 'Rate is required.',
        'nigativeNumber': 'Should not be a nigative number.'
      },
      total: {
        'required': 'Total is required.'
      },
      totalGST: {
        'required': 'Total with GST is required.'
      }
  }

  formMessage = {
      poNo: '',
      deliveryDate: '',
      requestedBy: '',
      approvedBy: '',
      deliveryAddress: '',
      deliveryAddressDetails: '',
      proHsn: '',
      proDesc: '',
      proCat: '',
      proMake: '',
      proQty: '',
      proGst: '',
      proRate: '',
      total: '',
      totalGST: '',
      venNm: '',
      insertError: '',
      successMessage: ''
  }

  constructor(
    private fb: FormBuilder,
    private ProductService: ProductsService,
    private VendorsService: VendorsService,
    private AddressService: AddressService,
    private PurchaseOrderService: PurchaseOrderService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getProductList();
    this.getVendorList();
    this.getAddressList();
    this.buildForm();

    this.poForm.valueChanges.subscribe(value => {    
        if(!this.products.length) {
          this.getProductList();
        }
        if(!this.vendors.length) {
          this.getVendorList();
        }
        if(!this.addressList.length) {
          this.getAddressList();
        }
        this.logValidationErrors(this.poForm);
    });
  }

  logValidationErrors(formGroup: FormGroup = this.poForm): void {
    const logValidationErrors = new LogValidationErrors(
                                    this.formMessage, this.validationMessages);
    
    ({formErrors: this.formMessage, validationMessages: this.validationMessages} 
        = logValidationErrors.validateFormControl(formGroup));
  }

  getProductList(callback = null) {
    this.ProductService.getProduct().subscribe((res:any) => {
      this.products = res;
      if(callback) callback();
    });
  }

  getVendorList() {
    this.VendorsService.getVendors().subscribe((res:any) => {
      this.vendors = res;
    });
  }

  getAddressList(callback = null) {
    this.AddressService.getAddress().subscribe((res:any) => {
      this.addressList = res;
      if(callback) callback();
    });
  }

  buildForm(): void {
    this.poForm = this.fb.group({
      poNo: [''],
      venId: ['', [Validators.required]],
      venNm: ['', [Validators.required, this.valitadeTheVendor.bind(this)]],
      vendorDetails: ['', [Validators.required]],
      addressId: ['', [Validators.required]],
      deliveryAddress: ['', [Validators.required, this.valitadeAddress.bind(this)]],
      deliveryAddressDetails: ['', [Validators.required]],
      deliveryDate: ['', [Validators.required]],
      requestedBy: ['', [Validators.required]],
      approvedBy: ['', [Validators.required]],
      department: [''],
      products: this.fb.array([this.addProductFormGroup()])
    });
  }

  addProductFormGroup(): FormGroup {
    return this.fb.group({
      proId: ['', [Validators.required]],
      proHsn: ['', [Validators.required]],
      proDesc: ['', [Validators.required, this.valitadeTheProduct.bind(this)]],
      proQty: ['', [Validators.required, positiveNumber.bind(this)]],
      proRate: ['', [Validators.required, nigativeNumber.bind(this)]],
      total: ['', [Validators.required]],
      proGst: ['', [Validators.required, nigativeNumber.bind(this)]],
      totalGST: ['', [Validators.required]]
    })
  }

  valitadeTheProduct(control: FormControl): { [key: string]: any; } {
    return isValidListItem(this.products, "proDesc", control.value);
  }

  valitadeTheVendor(control: FormControl): { [key: string]: any; } {
    return isValidListItem(this.vendors, "venNm", control.value);
  }

  valitadeAddress(control: FormControl): { [key: string]: any; } {
    return isValidListItem(this.addressList, "addressDet", control.value);
  }

  onAddProduct(): void {
    (<FormArray>this.poForm.get('products')).push(this.addProductFormGroup());
  }

  onRemoveProduct(index: number) :void {
    (<FormArray>this.poForm.get('products')).removeAt(index);
    this.setGrandTotal();
  }

  onProductSelect(event: any, row: number): void {
    let poProd = (<FormArray>this.poForm.get('products'));
    // poProd.controls[row].get("proHsn").setValue(item.item.proHsn);
    poProd.controls[row].patchValue({
      proId: event.item.proId,
      proHsn: event.item.proHsn,
      proGst: event.item.proGst})
  }
  
  clearProductDetails(row: number): void {
    let poProd = (<FormArray>this.poForm.get('products'));
    poProd.controls[row].patchValue({
      proId: null,
      proHsn: null,
      proGst: null,
      total: null,
      totalGST: null,
      proRate: null,
      proQty: null}
    );
  }

  setTotalAmount(row: number) {
    const poProd = (<FormArray>this.poForm.get('products'));
    const {proQty, proRate, proGst} = poProd.controls[row].value;

    if(proQty && proRate && proGst) {
      let amtObj = calculateGst(proGst, proQty, proRate);
      const {total, gstAmt, totalWithGst} = amtObj;

      poProd.controls[row].patchValue({
        total,
        totalGST: totalWithGst}
      );
    } else {
      poProd.controls[row].patchValue({
        total: null,
        totalGST: null}
      );
    }
    this.setGrandTotal();
  }

  setGrandTotal() {
    this.grandTotal = 0;
    const poProd = (<FormArray>this.poForm.get('products'));
    poProd.controls.forEach((control) => {
      this.grandTotal += Number(control.value.totalGST);
    });
  }

  onVendorSelect(event: TypeaheadMatch): void {
    const {venId, venAdd, venCon, venEmail, venGst, venPan} = event.item;
    let det = `Address: ${venAdd}\nContact: ${venCon}\nEmail: ${venEmail}\nGST: ${venGst}\nPAN: ${venPan}`;
    this.updatePOForm({vendorDetails: det, venId});
  }

  clearVendorDetails(): void {
    this.updatePOForm({vendorDetails: null, venId: null});
  }

  onAddressSelect(event: any): void {
    const {addressId, addressDet, addressContact, state, stateCode} = event.item;
    let det = `Address: ${addressDet}\nContact: ${addressContact}\nState: ${state}\nState Code: ${stateCode}`;
    this.updatePOForm({addressId, deliveryAddressDetails: det});
  }

  clearAddressDetails(): void {
    this.updatePOForm({addressId: null, deliveryAddressDetails: null});
  }

  updatePOForm(obj: any) {
    this.poForm.patchValue(obj);
  }

  onSubmit() :void {
    this.PurchaseOrderService.addPo(this.poForm.value).subscribe((res) => {
      this.formMessage.successMessage = res.message;
      this.formMessage.insertError = "";
      this.buildForm();
    }, (error) => {
      console.error("PO error:", error);
      this.formMessage.insertError = "PO was not added.";
      this.formMessage.successMessage = "";
    });
  }

  openFormModel(template: TemplateRef<any>, index: number = -1): void {
    this.bsModalRef = this.modalService.show(template);
    this._addProductRow = index;
  }

  onProductAdd(event: any): void {
      this.getProductList(() => {
          if(event.result) {
              let {insertId} = event.result.data;
              let newProduct = this.products.find(({proId}) => proId == insertId);
              if(newProduct && this._addProductRow != -1) {
                  this.onProductSelect({item: newProduct}, this._addProductRow);
                  let poProd = (<FormArray>this.poForm.get('products'));
                  poProd.controls[this._addProductRow].get("proDesc").setValue(newProduct.proDesc);
                  poProd.controls[this._addProductRow].get("proId").setValue(newProduct.proId);
              }
              this.bsModalRef.hide();
          }
      });
  }

  onAddressAdd(event: any): void {
      this.getAddressList(() => {
          if(event.result) {
              let {insertId} = event.result.data;
              let newAddress = this.addressList.find(({addressId}) => addressId == insertId);
              this.updatePOForm({
                  addressId: newAddress.addressId,
                  deliveryAddress: newAddress.addressDet
              });
              this.onAddressSelect({item: newAddress});
              this.bsModalRef.hide();
          }
      });
  }

}
