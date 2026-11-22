import { Component, inject, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

// Shared components (used inside app.html)
import { Sidebar } from './components/sidebar/sidebar';
import { ExpenseForm } from './components/expense-form/expense-form';
import { ExpenseList } from './components/expense-list/expense-list';

// Pages (shown by the router, listed below for reference only)
import { Dashboard } from './pages/dashboard/dashboard';
import { Expenses } from './pages/expenses/expenses';
import { Balances } from './pages/balances/balances';
import { Groups } from './pages/groups/groups';
import { Splits } from './pages/splits/splits';

// Shared data
import { ExpenseService } from './services/expense';

@Component({
  selector: 'app-root',
  // Only the things app.html actually uses go here
  imports: [
    RouterOutlet,   // shows the current page
    FormsModule,    // [(ngModel)] two-way binding
    DecimalPipe,    // number pipe
    Sidebar,        // top navigation bar
    ExpenseForm,    // quick add form
    ExpenseList,    // quick add list
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // ---------- Shared data ----------
  svc = inject(ExpenseService);

  // ---------- Page registry ----------
  // Mentions every page component in one place.
  // It is plain data: it does not render anything and does not change the page.
  readonly pages = [
    { label: 'Dashboard', path: '/dashboard', component: Dashboard },
    { label: 'Expenses', path: '/expenses', component: Expenses },
    { label: 'Balances', path: '/balances', component: Balances },
    { label: 'Groups', path: '/groups', component: Groups },
    { label: 'Splits', path: '/splits', component: Splits },
  ];

  // ---------- Plain values (one-way binding) ----------
  title = 'Shared Expense Splitter';
  year = new Date().getFullYear();
  spendLimit = 10000;

  // ---------- State changed by the user (two-way binding) ----------
  showQuickAdd = signal(false);
  search = signal('');

  // ---------- Derived values ----------
  filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.svc
      .expenses()
      .filter(e =>
        e.description.toLowerCase().includes(term) ||
        e.paidBy.toLowerCase().includes(term) ||
        e.group.toLowerCase().includes(term)
      );
  });

  overLimit = computed(() => this.svc.total() > this.spendLimit);

  // ---------- Event handlers ----------
  clearSearch() {
    this.search.set('');
  }
}