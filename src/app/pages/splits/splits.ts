import { Component, inject, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ExpenseService } from '../../services/expense';

@Component({
  selector: 'app-splits',
  imports: [DecimalPipe],
  templateUrl: './splits.html',
  styleUrl: './splits.css',
})
export class Splits {
  svc = inject(ExpenseService);

  selected = signal(this.svc.members[0]);
  ledger = computed(() => this.svc.ledger(this.selected()));

  abs(n: number) {
    return Math.abs(n);
  }

  pick(name: string) {
    this.selected.set(name);
  }
}