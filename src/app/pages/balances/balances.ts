import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ExpenseService } from '../../services/expense';

@Component({
  selector: 'app-balances',
  imports: [DecimalPipe],
  templateUrl: './balances.html',
  styleUrl: './balances.css',
})
export class Balances {
  svc = inject(ExpenseService);

  abs(n: number) {
    return Math.abs(n);
  }
}