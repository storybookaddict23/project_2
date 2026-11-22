import { Injectable, signal, computed } from '@angular/core';

export interface ExpenseItem {
  id: number;
  description: string;
  amount: number;
  paidBy: string;
  group: string;
  participants: string[];
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  members = ['Asha', 'Ravi', 'Meera'];

  groups = signal<string[]>(['Goa Trip', 'Flatmates']);

  expenses = signal<ExpenseItem[]>([
    { id: 1, description: 'Hotel', amount: 6000, paidBy: 'Asha', group: 'Goa Trip',
      participants: ['Asha', 'Ravi', 'Meera'] },
    { id: 2, description: 'Groceries', amount: 1500, paidBy: 'Ravi', group: 'Flatmates',
      participants: ['Ravi', 'Meera'] },
  ]);

  total = computed(() => this.expenses().reduce((sum, e) => sum + e.amount, 0));

  shareOf(e: ExpenseItem) {
    return e.amount / e.participants.length;
  }

  splitRows(e: ExpenseItem) {
    const share = this.shareOf(e);
    return this.members.map(name => {
      const involved = e.participants.includes(name);
      const paid = e.paidBy === name ? e.amount : 0;
      const owed = involved ? share : 0;
      return { name, involved, paid, share: owed, net: paid - owed };
    });
  }

  balances = computed(() =>
    this.members.map(name => {
      const paid = this.expenses()
        .filter(e => e.paidBy === name)
        .reduce((sum, e) => sum + e.amount, 0);
      const owed = this.expenses()
        .filter(e => e.participants.includes(name))
        .reduce((sum, e) => sum + e.amount / e.participants.length, 0);
      return { name, paid, owed, balance: paid - owed };
    })
  );

  ledger(name: string) {
    let running = 0;
    const rows = this.expenses().map(e => {
      const involved = e.participants.includes(name);
      const share = involved ? e.amount / e.participants.length : 0;
      const paid = e.paidBy === name ? e.amount : 0;
      const net = paid - share;
      running += net;
      return {
        id: e.id, description: e.description, group: e.group, amount: e.amount,
        paidBy: e.paidBy, involved, share, paid, net, running,
      };
    });
    const totalPaid = rows.reduce((s, r) => s + r.paid, 0);
    const totalOwed = rows.reduce((s, r) => s + r.share, 0);
    return { rows, totalPaid, totalOwed, net: totalPaid - totalOwed };
  }

  settlements = computed(() => {
    const debtors = this.balances()
      .filter(b => b.balance < -0.005)
      .map(b => ({ name: b.name, amt: -b.balance }))
      .sort((a, b) => b.amt - a.amt);
    const creditors = this.balances()
      .filter(b => b.balance > 0.005)
      .map(b => ({ name: b.name, amt: b.balance }))
      .sort((a, b) => b.amt - a.amt);

    const result: { from: string; to: string; amount: number }[] = [];
    let i = 0;
    let j = 0;
    while (i < debtors.length && j < creditors.length) {
      const pay = Math.min(debtors[i].amt, creditors[j].amt);
      result.push({ from: debtors[i].name, to: creditors[j].name, amount: pay });
      debtors[i].amt -= pay;
      creditors[j].amt -= pay;
      if (debtors[i].amt < 0.005) i++;
      if (creditors[j].amt < 0.005) j++;
    }
    return result;
  });

  add(e: Omit<ExpenseItem, 'id'>) {
    this.expenses.update(list => [...list, { ...e, id: Date.now() }]);
  }

  remove(id: number) {
    this.expenses.update(list => list.filter(e => e.id !== id));
  }

  // Returns an error message, or '' when the group was added
  addGroup(name: string): string {
    const n = name.trim();
    if (!n) return 'Please enter a group name.';
    if (this.groups().some(g => g.toLowerCase() === n.toLowerCase())) {
      return 'That group already exists.';
    }
    this.groups.update(list => [...list, n]);
    return '';
  }

  // Only empty groups can be removed
  removeGroup(name: string): boolean {
    if (this.expenses().some(e => e.group === name)) return false;
    this.groups.update(list => list.filter(g => g !== name));
    return true;
  }
}