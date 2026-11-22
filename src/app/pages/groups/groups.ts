import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ExpenseService } from '../../services/expense';

@Component({
  selector: 'app-groups',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './groups.html',
  styleUrl: './groups.css',
})
export class Groups {
  svc = inject(ExpenseService);

  newGroup = signal('');
  error = signal('');

  add() {
    const msg = this.svc.addGroup(this.newGroup());
    this.error.set(msg);
    if (!msg) this.newGroup.set('');
  }

  remove(name: string) {
    if (!this.svc.removeGroup(name)) {
      this.error.set('Delete the expenses in "' + name + '" first.');
    } else {
      this.error.set('');
    }
  }

  expensesIn(group: string) {
    return this.svc.expenses().filter(e => e.group === group);
  }

  totalIn(group: string) {
    return this.expensesIn(group).reduce((sum, e) => sum + e.amount, 0);
  }
}