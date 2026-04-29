import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { footerLink } from '../../../data/nav-data';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-footer-one',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './footer-one.html',
  styleUrl: './footer-one.css'
})
export class FooterOne {

  footerLink = footerLink;
  year: any;
  apiData: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    this.year = new Date().getFullYear();
    this.globalService.masterDataObs.subscribe((data: any) => {
      if (data) {
        this.apiData = data;
        this.cdr.detectChanges();
      }
    });
  }

  scrollToTop() {
    window.scroll(0, 0);
  }
}
