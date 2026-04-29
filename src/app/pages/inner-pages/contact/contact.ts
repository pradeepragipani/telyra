import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarOne } from "../../../components/navbar/navbar-one/navbar-one";
import Aos from 'aos';
import { FooterOne } from "../../../components/footer/footer-one/footer-one";
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    RouterLink,
    NavbarOne,
    FooterOne
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {

  isLoading: boolean = false;
  apiData: any;

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
