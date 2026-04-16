import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarOne } from "../../../components/navbar/navbar-one/navbar-one";
import Aos from 'aos';
import { FooterOne } from "../../../components/footer/footer-one/footer-one";

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

  constructor() { }

  ngOnInit(): void {
    Aos.init();
  }

}
