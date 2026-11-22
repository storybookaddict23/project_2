import { Component, inject } from '@angular/core';
import { ExpenseService } from '../../services/expense';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  svc = inject(ExpenseService);
}