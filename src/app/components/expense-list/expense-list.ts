import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ExpenseItem } from '../../services/expense';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList {
  @Input() expenses: ExpenseItem[] = [];
  @Output() remove = new EventEmitter<number>();
}