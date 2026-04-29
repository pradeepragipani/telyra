import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { ApiService } from '../../../services/api.service';
import { GlobalService } from '../../../services/global.service';
import { NavbarOne } from '../../../components/navbar/navbar-one/navbar-one';
import { interval, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-qr-payment',
  standalone: true,
  imports: [RouterLink, QRCodeComponent, NavbarOne],
  templateUrl: './qr-payment.component.html',
  styleUrl: './qr-payment.component.css'
})
export class QrPaymentComponent implements OnInit, OnDestroy {

  qrCodeStr: string = '';
  pageTitle: string = '';
  countdown: number = 60;
  sub!: Subscription;

  private intervalId: any;

  user: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private globalService: GlobalService
  ) { }

  ngOnInit(): void {

    // get user from store
    this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
    this.route.queryParams.subscribe(params => {
      if (params['qrCode']) {
        this.qrCodeStr = params['qrCode'];
        this.pageTitle = 'Scan QR Code to Pay';

        this.sub = interval(1000)
          .pipe(take(60))
          .subscribe(() => {
            this.countdown--;
            this.cdr.detectChanges();

            if (this.countdown === 0) {
              this.router.navigate(['/']);
            }
          });
        setTimeout(() => {
          this.checkTransactionStatus();
        }, 60000);
        this.cdr.detectChanges();
      } else {
        this.globalService.error("Unable to process the payment");
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (this.intervalId) clearInterval(this.intervalId);
  }

  async waitAndRun() {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  format(val: number): string {
    return val > 9 ? val.toString() : '0' + val;
  }

  checkTransactionStatus() {
    const data = {
      userid: this.user?.userid
    };
    this.apiService.postData('/getTransactionStatus', data).subscribe((res: any) => {
      if (res && res.code === 0) {
        this.globalService.error(res.message); // replace with toastr
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
