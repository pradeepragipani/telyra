import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { NavbarOne } from "../../../components/navbar/navbar-one/navbar-one";
import { ActivatedRoute, RouterLink } from '@angular/router';
import Aos from 'aos';
import { FooterOne } from "../../../components/footer/footer-one/footer-one";
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../../services/global.service';

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
  
  isLoading: boolean = false;
  load: any;
  apiData: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    Aos.init();
    this.route.queryParams.subscribe(params => {
      if (params['load']) {
        this.load = params['load'];
      }
    });
    this.globalService.masterDataObs.subscribe((data: any) => {
      if (data) {
        this.apiData = data;
        this.cdr.detectChanges();
      }
    });
  }
}
