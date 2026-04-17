import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarOne } from '../../../components/navbar/navbar-one/navbar-one';
import { LayoutOne } from '../../../components/product/layout-one/layout-one';
import { FooterOne } from '../../../components/footer/footer-one/footer-one';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { ApiService } from '../../../services/api.service';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-icons-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NavbarOne,
    LayoutOne,
    FooterOne,
    PaginationComponent,
  ],
  templateUrl: './icons-list.component.html',
  styleUrl: './icons-list.component.css'
})
export class IconsListComponent {

  isLoading: boolean = false;
  iconsList: any[] = [];
  page = 1;
  noOfPages = 0;
  pageSize = 24;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    this.getIcons();
  }

  getIcons(): void {
    this.isLoading = true;
    this.iconsList = [];
    this.apiService.postData('getIcons',
      { page: this.page, per_page: this.pageSize }
    ).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.code === 0) {
          this.iconsList = res.items;
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

  pageChange(val: number) {
    window.scrollTo(0, 0);
    this.page = val;
    this.getIcons();
  }
}
