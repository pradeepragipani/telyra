import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarOne } from "../../../components/navbar/navbar-one/navbar-one";
import Aos from 'aos';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { featureOne } from '../../../data/data';
import { PartnerOne } from "../../../components/partner/partner-one/partner-one";
import { FooterOne } from "../../../components/footer/footer-one/footer-one";

@Component({
  selector: 'app-about',
  imports: [
    CommonModule,
    RouterLink,
    NavbarOne,
    CarouselModule,
    PartnerOne,
    FooterOne
],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {

  constructor() {}

  ngOnInit(): void {
    Aos.init();
  }

  open:boolean = false

  feature = featureOne
}
