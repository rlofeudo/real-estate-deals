import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  Deal,
  PriceFilterOperator,
  calculateCapRate,
  formatCapRate,
} from '../../../core/models/deal.model';
import { AuthStore } from '../../../core/state/auth/auth.store';
import { DEFAULT_FILTERS } from '../../../core/state/deal.state';
import { DealStore } from '../../../core/state/deals/deal.store';
import { HighlightPipe } from '../../../shared/pipes/highlight.pipe';

@Component({
  selector: 'app-deal-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    HighlightPipe,
  ],
  templateUrl: './deal-list.component.html',
  styleUrl: './deal-list.component.scss',
})
export class DealListComponent implements OnInit {
  private readonly dealStore = inject(DealStore);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly displayedColumns = [
    'name',
    'purchasePrice',
    'address',
    'noi',
    'capRate',
    'actions',
  ] as const;

  readonly username = this.authStore.username;
  readonly vm = this.dealStore.listVm;

  readonly filterForm = this.fb.nonNullable.group({
    name: [''],
    purchasePrice: ['' as string],
    priceOperator: ['greater' as PriceFilterOperator],
  });

  ngOnInit(): void {
    this.restoreFiltersFromStore();

    this.filterForm.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(
          (a, b) =>
            a.name === b.name &&
            a.purchasePrice === b.purchasePrice &&
            a.priceOperator === b.priceOperator
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        const priceRaw = value.purchasePrice?.toString().trim() ?? '';
        const purchasePrice =
          priceRaw === '' ? null : Number(priceRaw.replace(/,/g, ''));

        this.dealStore.setFilters({
          name: value.name ?? '',
          purchasePrice:
            purchasePrice !== null && !Number.isNaN(purchasePrice)
              ? purchasePrice
              : null,
          priceOperator: value.priceOperator ?? DEFAULT_FILTERS.priceOperator,
        });
      });
  }

  onPage(event: PageEvent): void {
    this.dealStore.setPageIndex(event.pageIndex);
  }

  clearFilters(): void {
    this.filterForm.reset(
      {
        name: DEFAULT_FILTERS.name,
        purchasePrice: '',
        priceOperator: DEFAULT_FILTERS.priceOperator,
      },
      { emitEvent: false }
    );
    this.dealStore.clearFilters();
  }

  editDeal(deal: Deal): void {
    void this.router.navigate(['/deals', deal.id, 'edit']);
  }

  capRate(deal: Deal): string {
    return formatCapRate(calculateCapRate(deal.noi, deal.purchasePrice));
  }

  logout(): void {
    this.authStore.logout();
  }

  private restoreFiltersFromStore(): void {
    const { name, purchasePrice, priceOperator } = this.dealStore.filters();

    this.filterForm.setValue(
      {
        name,
        purchasePrice:
          purchasePrice === null || purchasePrice === undefined
            ? ''
            : String(purchasePrice),
        priceOperator,
      },
      { emitEvent: false }
    );
  }
}
