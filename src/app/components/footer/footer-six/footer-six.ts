import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { footerLink } from '../../../data/nav-data';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer-six',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './footer-six.html',
  styleUrl: './footer-six.css'
})
export class FooterSix {

  year: any

  footerLink = footerLink;

  constructor() { }

  ngOnInit(): void {
    this.year = new Date().getFullYear()
  }

  scrollToTop() {
    window.scroll(0, 0);
  }
}
