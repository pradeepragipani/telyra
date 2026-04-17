import { ChangeDetectorRef, Component } from '@angular/core';
import { NavbarOne } from "../../../components/navbar/navbar-one/navbar-one";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { productList } from '../../../data/data';
import Aos from 'aos';
import { LayoutOne } from "../../../components/product/layout-one/layout-one";
import { FooterOne } from "../../../components/footer/footer-one/footer-one";
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../../services/global.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-shop-v1',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NavbarOne,
    LayoutOne,
    FooterOne,
    PaginationComponent,
],
  templateUrl: './shop-v1.html',
  styleUrl: './shop-v1.css'
})
export class ShopV1 {

  isLoading: boolean = false;
  categoryList: any[] = [];
  itemsList: any[] = [];
  page = 1;
  noOfPages = 0;
  pageSize = 12;
  params: any = {};
  selectedCategory = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private globalService: GlobalService,
  ) {
    this.globalService.categories$.subscribe((res: any) => this.categoryList = res ? res : []);
    this.route.queryParams.subscribe((res: any) => {
      this.params = res;
      if (this.params['category']) {
        this.page = 1;
        this.noOfPages = 0;
        const categories = this.params['category'] ? this.params['category'].split(',') : [];
        this.selectedCategory = categories.length > 0 ? categories : []
        this.getItems();
      } else {
        this.getItems();
      }
    });
  }

  getItems(): void {
    this.isLoading = true;
    this.itemsList = [];
    this.apiService.postData('getItemsByCategory',
      { cat_ids: this.selectedCategory, page: this.page, per_page: this.pageSize }
    ).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.code === 0) {
          this.itemsList = res.items;
          this.noOfPages = res.pages;
          this.cdr.detectChanges();
        } else if (res.code == 5) {
          this.globalService.error('Session expired');
          // this.globalService.logout();
        }
      }, error: (error: any) => {
        this.isLoading = false;
      }, complete: () => {
        this.isLoading = false;
      }
    });
  }

  onCategoryClick(id: any) {
    this.selectedCategory = id;
    this.router.navigate([], { queryParams: { category: id }});
  }

  pageChange(val: number) {
    window.scrollTo(0,0);
    this.page = val;
    this.getItems();
  }
}
