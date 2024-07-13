
import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ProductListComponent } from './component/product-list/product-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProductServiceService } from './services/product-service.service';
import {Routes,RouterModule, Router} from '@angular/router';
import { ProductCategoryComponent } from './component/product-category/product-category.component';
import { SearchProductComponent } from './component/search-product/search-product.component';
import { ProductDetailsComponent } from './component/product-details/product-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './component/cart-status/cart-status.component';
import { CartDetailsComponent } from './component/cart-details/cart-details.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './component/login/login.component';
import { LoginStatusComponent } from './component/login-status/login-status.component';

import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MembersPageComponent } from './component/members-page/members-page.component';
import { OrderHistoryComponent } from './component/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptors.service';
import { RegisterComponent } from './component/register/register.component';
import { AuthGuard } from './services/auth.guard';




const routes: Routes = [
  { path: 'orders-history', component: OrderHistoryComponent },
  { path: 'member', component: MembersPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'cartdetails', component: CartDetailsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'search/:keyword', component: ProductListComponent },
  { path: 'category/:id', component: ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'products', component: ProductListComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products', pathMatch: 'full' }
];
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryComponent,
    SearchProductComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent,
    RegisterComponent,
  ],
  imports: [
       BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NgbModule,
    ReactiveFormsModule, FormsModule,



  ],
  //specifying in providers will allow to use product service into other class
  providers: [ProductServiceService,  AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
