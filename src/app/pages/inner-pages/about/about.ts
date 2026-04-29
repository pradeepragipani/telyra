import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarOne } from "../../../components/navbar/navbar-one/navbar-one";
import Aos from 'aos';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PartnerOne } from "../../../components/partner/partner-one/partner-one";
import { FooterOne } from "../../../components/footer/footer-one/footer-one";
import { GlobalService } from '../../../services/global.service';
import { featureOne } from '../../../data/data';

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

  isLoading: boolean = false;
  apiData: any;
  open:boolean = false;
  feature = featureOne;

  constructor(
    private cdr: ChangeDetectorRef,
    private globalService: GlobalService,
  ) {}

  ngOnInit(): void {
    Aos.init();
    this.globalService.masterDataObs.subscribe((data: any) => {
      if (data) {
        this.apiData = data;
        this.cdr.detectChanges();
      }
    });
  }
}
