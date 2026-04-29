import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarOne } from "../../../components/navbar/navbar-one/navbar-one";
import Aos from 'aos';
import { FooterOne } from "../../../components/footer/footer-one/footer-one";
import { GlobalService } from '../../../services/global.service';
import { ApiService } from '../../../services/api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NavbarOne,
    FooterOne
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {

  showCoupon: boolean = false;

  isLoading: boolean = false;
  checkoutDisable: boolean = false;
  makingPayment: boolean = false;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');
  userData: any = JSON.parse(localStorage.getItem('userLoginData') || '{}');
  isLoggedIn: boolean = false;
  cartItem: boolean = false;
  cartItems: any[] = [];
  cartTotal: number = 0;

  orderId: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private globalService: GlobalService,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    Aos.init();
    this.globalService.loggedInUserObservable.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
    this.globalService.cartItemsObservable.subscribe(items => {
      this.cartItem = items.length > 0;
      this.cartItems = items;
      this.cartTotal = items.reduce((total, item) => total + (item.itemcost * item.quantity), 0);
    });
  }

  getCartCount(cartItems: any[]): number {
    let total = 0;

    for (let i = 0; i < cartItems.length; i++) {
      total += parseInt(cartItems[i].quantity, 10);
    }

    return total;
  }

  handleOrder(): void {
    this.checkoutDisable = true;

    const items: any[] = [];
    this.cartItems.forEach((ele: any) => items.push({
      item_id: ele.id,
      quantity: 1,
      item_cost: +ele.itemcost
    }));
    const order = {
      total_cost: this.cartTotal.toString(),
      items: items
    };

    this.apiService.postDataWithHeaders('createOrder', order, {
      Authorization: 'Bearer ' + this.userData.auth_token,
    }).subscribe({
      next: (res: any) => {
        this.checkoutDisable = false;
        if (res.code === 0) {
          this.createPayment(res);
        } else if (res.code === 5) {
          this.globalService.logout();
          this.router.navigate(['/login']);
          this.globalService.error("Session expired. Please login again.");
        } else {
          this.globalService.error("Something Went Wrong. Please Try Again");
        }
      }, error: (error) => {
        this.checkoutDisable = false;
        this.cdr.detectChanges();
      }, complete: () => {
        this.checkoutDisable = false;
        this.cdr.detectChanges();
      }
    });
  }

  createPayment(res: any): void {
    this.orderId = res.response;
    this.makingPayment = true;
    const paymentData = {
      amount: this.cartTotal,
      order_id: res.order_id
    };

    this.apiService.postDataWithHeaders('createPayment', paymentData, {
      Authorization: 'Bearer ' + this.userData.auth_token,
    }).subscribe({
      next: (payRes: any) => {
        this.makingPayment = false;
        if (payRes.code === 0) {
          this.globalService.success(payRes.message);
          this.globalService.clearCart();
          this.router.navigate(['/qr-payment'], {
            queryParams: {
              qrCode: payRes.shortURL,
            }
          });
        } else if (payRes.code === 2) {
          this.globalService.warning(payRes.message);
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 500);
        } else {
          this.globalService.error('Payment failed. Try again');
        }
        this.cdr.detectChanges();
      }, error: (error) => {
        this.makingPayment = false;
        this.cdr.detectChanges();
      }, complete: () => {
        this.makingPayment = false;
        this.cdr.detectChanges();
      }
    });
  }
}
