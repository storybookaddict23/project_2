import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExpenseItem } from '../../services/expense';

@Component({
  selector: 'app-expense-form',
  imports: [FormsModule],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
export class ExpenseForm implements OnInit {
  @Input() members: string[] = [];
  @Input() groups: string[] = [];
  @Output() added = new EventEmitter<Omit<ExpenseItem, 'id'>>();

  description = '';
  amount: number | null = null;
  paidBy = '';
  group = '';
  selected: string[] = [];

  ngOnInit() {
    this.paidBy = this.members[0];
    this.group = this.groups[0];
    this.selected = [...this.members];
  }

  toggle(name: string) {
    this.selected = this.selected.includes(name)
      ? this.selected.filter(m => m !== name)
      : [...this.selected, name];
  }

  submit() {
    if (!this.description || !this.amount || this.selected.length === 0) return;
    this.added.emit({
      description: this.description,
      amount: this.amount,
      paidBy: this.paidBy,
      group: this.group,
      participants: [...this.selected],
    });
    this.description = '';
    this.amount = null;
  }
}