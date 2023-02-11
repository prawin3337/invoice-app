import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { from } from 'rxjs';

import { AuthGuard } from './auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { HomeComponent } from './home/home.component';
import { MonthlySaleComponent } from './dashboard/monthly-sale/monthly-sale.component';
import { CustomerWiseSaleComponent } from './dashboard/customer-wise-sale/customer-wise-sale.component';
import { PurchaseOrderComponent } from './forms/purchase/purchase-order/purchase-order.component';
import { AddProductComponent } from './forms/product/add-product/add-product.component';
import { AddAddressComponent } from './forms/address/add-address/add-address.component';
import { ViewPurchaseOrderComponent } from './forms/purchase/view-purchase-order/view-purchase-order.component';


const routes: Routes = [
  {
      path: 'home',
      component: HomeComponent,
      canActivate: [AuthGuard]
  },{
      path: 'login',
      component: LoginComponent
  },{
    path: 'logout',
    component: LogoutComponent
  },{
      path: 'dashboard',
      children: [{
          path: 'monthlysale',
          component: MonthlySaleComponent
      }, {
          path: 'customerwisesale',
          component: CustomerWiseSaleComponent
      }],
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard]
  },{
      path: 'form',
      children: [{
          path: 'po/add',
          component: PurchaseOrderComponent
      },{
          path: 'product/add',
          component: AddProductComponent
      },{
          path: 'address/add',
          component: AddAddressComponent
      },{
        path: 'po/view',
        component: ViewPurchaseOrderComponent
  }],
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard]
  },{
      path: '**',
      component: PageNotFoundComponent,
      canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
