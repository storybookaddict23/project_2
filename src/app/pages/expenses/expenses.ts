import { Component, inject } from '@angular/core';
import { ExpenseService } from '../../services/expense';
import { ExpenseForm } from '../../components/expense-form/expense-form';
import { ExpenseList } from '../../components/expense-list/expense-list';

@Component({
  selector: 'app-expenses',
  imports: [ExpenseForm, ExpenseList],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses {
  svc = inject(ExpenseService);
}