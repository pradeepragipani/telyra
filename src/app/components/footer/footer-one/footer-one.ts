import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { footerLink } from '../../../data/nav-data';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';

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

  year: any

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.year = new Date().getFullYear()
  }

  scrollToTop() {
    window.scroll(0, 0);
  }
}
