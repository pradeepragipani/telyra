import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    NgClass,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Input() totalPages: number = 0;
  @Input() itemsPerPage: number = 12;

  maxPagesToShow: number = 7;

  @Output() pageChange = new EventEmitter<number>();

  pages: number[] = [];

  ngOnInit(): void {
    this.calculatePages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalPages'] || changes['itemsPerPage'] || changes['currentPage']) {
      this.calculatePages();
    }
  }

  calculatePages(): void {
    this.pages = this.generatePageNumbers(this.currentPage, this.totalPages, this.maxPagesToShow);
  }

  private generatePageNumbers(currentPage: number, totalPages: number, maxPagesToShow: number): number[] {
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    return Array.from({length: (endPage - startPage + 1)}, (_, i) => startPage + i);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }
}
