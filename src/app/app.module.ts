import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MonthlySaleComponent } from './dashboard/monthly-sale/monthly-sale.component';
import { CustomerWiseSaleComponent } from './dashboard/customer-wise-sale/customer-wise-sale.component';
import { PurchaseOrderComponent } from './forms/purchase/purchase-order/purchase-order.component';
import { HttpConfigInterceptor } from './interceptor/httpconfig.interceptor';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { AddProductComponent } from './forms/product/add-product/add-product.component';
import { AddAddressComponent } from './forms/address/add-address/add-address.component';
import { from } from 'rxjs';
import { ViewPurchaseOrderComponent } from './forms/purchase/view-purchase-order/view-purchase-order.component';


@NgModule({
  declarations: [
    AppComponent,
    MonthlySaleComponent,
    CustomerWiseSaleComponent,
    PurchaseOrderComponent,
    PageNotFoundComponent,
    LoginComponent,
    HomeComponent,
    LogoutComponent,
    AddProductComponent,
    AddAddressComponent,
    ViewPurchaseOrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule, 
    NgxChartsModule,
    BrowserAnimationsModule,
    TypeaheadModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
