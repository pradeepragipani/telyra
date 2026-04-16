import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarOne } from "../../../components/navbar/navbar-one/navbar-one";
import Aos from 'aos';
import { servicesData } from '../../../data/index-three';
import { productList } from '../../../data/data';
import { BlogSix } from "../../../components/blogs/blog-six/blog-six";
import { PartnerOne } from "../../../components/partner/partner-one/partner-one";
import { FooterSix } from "../../../components/footer/footer-six/footer-six";
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../../services/global.service';
import { CarouselModule } from 'ngx-owl-carousel-o';

interface ProductList {
  id: number;
  image: string;
  tag: string;
  price: string;
  name: string;
}

@Component({
  selector: 'app-index-six',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CarouselModule,
    NavbarOne,
    BlogSix,
    PartnerOne,
    FooterSix
  ],
  templateUrl: './index-six.html',
  styleUrl: './index-six.css'
})
export class IndexSix {

  servicesData = servicesData
  productList: ProductList[] = productList

  tendingArtwork: any[] = [];
  popularcategories: any[] = [];
  trendingItems: any[] = [];
  hotCollections: any[] = [];

  customOptions = {
    loop: true,
    margin: 30,
    nav: false,
    items:1,
    dots:true,
    autoplay:true,
    responsive:{
      0:{items:1}
    }
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
    private globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    Aos.init();
    this.getTrendingArtwork();
    this.getTrendingItems();
    this.getHotCollections();
    this.globalService.categories$.subscribe(categories => {
      if (categories) {
        this.popularcategories = categories;
      }
    });
  }

  getTrendingArtwork(): void {
    this.apiService.postData('getTopCatItems',
      { cat_id: 46, count: 4 }
    ).subscribe({
      next: (data) => {
        this.tendingArtwork = data.items;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading API data', error);
      }
    });
  }
  getTrendingItems(): void {
    this.apiService.postData('getTopItems', {}).subscribe({
      next: (data) => {
        this.trendingItems = data.items;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading API data', error);
      }
    });
  }
  getHotCollections(): void {
    this.apiService.postData('getTopTwoItems',
      { count: 8 }
    ).subscribe({
      next: (data) => {
        this.hotCollections = data.items;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading API data', error);
      }
    });
  }
}
