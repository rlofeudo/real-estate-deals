import { Component, OnInit, effect, inject, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { map, startWith } from 'rxjs';
import {
  Deal,
  calculateCapRate,
  formatCapRate,
} from '../../../core/models/deal.model';
import { AuthStore } from '../../../core/state/auth/auth.store';
import { DealStore } from '../../../core/state/deals/deal.store';

@Component({
  selector: 'app-deal-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './deal-form.component.html',
  styleUrl: './deal-form.component.scss',
})
export class DealFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly dealStore = inject(DealStore);
  private readonly authStore = inject(AuthStore);

  readonly username = this.authStore.username;
  readonly vm = this.dealStore.formVm;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    purchasePrice: [0, [Validators.required, Validators.min(1)]],
    address: ['', [Validators.required, Validators.maxLength(200)]],
    noi: [0, [Validators.required, Validators.min(0)]],
  });

  readonly capRateDisplay = toSignal(
    this.form.valueChanges.pipe(
      startWith(null),
      map(() => {
        const { noi, purchasePrice } = this.form.getRawValue();
        return formatCapRate(
          calculateCapRate(Number(noi) || 0, Number(purchasePrice) || 0)
        );
      })
    ),
    { initialValue: '—' }
  );

  constructor() {
    effect(() => {
      const vm = this.vm();
      if (!vm.loading && vm.deal) {
        untracked(() => this.patchForm(vm.deal!));
      }
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const dealId = !idParam || idParam === 'new' ? null : Number(idParam);
    this.dealStore.loadDeal(dealId);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dealStore.saveDeal(this.form.getRawValue());
  }

  logout(): void {
    this.authStore.logout();
  }

  private patchForm(deal: Deal): void {
    this.form.setValue({
      name: deal.name,
      purchasePrice: deal.purchasePrice,
      address: deal.address,
      noi: deal.noi,
    });
  }
}
