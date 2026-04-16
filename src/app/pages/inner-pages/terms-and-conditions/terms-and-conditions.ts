import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarOne } from "../../../components/navbar/navbar-one/navbar-one";
import { ActivatedRoute, RouterLink } from '@angular/router';
import Aos from 'aos';
import { FooterOne } from "../../../components/footer/footer-one/footer-one";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-terms-and-conditions',
  imports: [
    CommonModule,
    FormsModule,
    NavbarOne,
    RouterLink,
    FooterOne
  ],
  templateUrl: './terms-and-conditions.html',
  styleUrl: './terms-and-conditions.css'
})
export class TermsAndConditions {
  
  load: any;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    Aos.init();
    this.route.queryParams.subscribe(params => {
      if (params['load']) {
        this.load = params['load'];
      }
    });
  }
}
