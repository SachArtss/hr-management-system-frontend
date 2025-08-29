import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Salary } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private apiUrl = `${environment.apiUrl}/salaries`;

  // Tax rate (20% as per your previous implementation)
  private readonly TAX_RATE = 0.2;

  constructor(private http: HttpClient) { }

  // GET all salaries
  getSalaries(): Observable<Salary[]> {
    return this.http.get<Salary[]>(this.apiUrl);
  }

  // GET single salary by ID
  getSalary(id: number): Observable<Salary> {
    return this.http.get<Salary>(`${this.apiUrl}/${id}`);
  }

  // GET salaries by employee
  getSalariesByEmployee(employeeId: number): Observable<Salary[]> {
    return this.http.get<Salary[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  // GET current salary for employee
  getCurrentSalaryForEmployee(employeeId: number): Observable<Salary> {
    return this.http.get<Salary>(`${this.apiUrl}/employee/${employeeId}/current`);
  }

  // POST create new salary - with automatic calculation of derived fields
  addSalary(salaryData: Omit<Salary, 'id' | 'grossAmount' | 'taxDeductions' | 'netAmount' | 'createdAt' | 'updatedAt'>): Observable<Salary> {
    // Calculate derived fields before sending to backend
    const salaryWithCalculations = this.calculateDerivedFields(salaryData);
    return this.http.post<Salary>(this.apiUrl, salaryWithCalculations);
  }

  // PUT update salary - with automatic calculation of derived fields
  updateSalary(salary: Salary): Observable<Salary> {
    // Ensure derived fields are calculated
    const updatedSalary = this.calculateDerivedFields(salary);
    return this.http.patch<Salary>(`${this.apiUrl}/${salary.id}`, updatedSalary);
  }

  // DELETE salary
  deleteSalary(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // GET salary history for employee
  getSalaryHistory(employeeId: number): Observable<Salary[]> {
    return this.http.get<Salary[]>(`${this.apiUrl}/employee/${employeeId}/history`);
  }

  // SEARCH salaries
  searchSalaries(term: string): Observable<Salary[]> {
    return this.http.get<Salary[]>(`${this.apiUrl}/search`, {
      params: { q: term }
    });
  }

  // GET salary statistics
  getSalaryStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  // CALCULATE derived fields for a new salary (for frontend preview/display)
  calculateNewSalary(baseAmount: number, bonus: number = 0): {
    grossAmount: number;
    taxDeductions: number;
    netAmount: number;
  } {
    const grossAmount = baseAmount + (bonus || 0);
    const taxDeductions = grossAmount * this.TAX_RATE;
    const netAmount = grossAmount - taxDeductions;

    return {
      grossAmount: this.roundToTwoDecimals(grossAmount),
      taxDeductions: this.roundToTwoDecimals(taxDeductions),
      netAmount: this.roundToTwoDecimals(netAmount)
    };
  }

  // CALCULATE annual salary from different payment frequencies
  calculateAnnualSalary(baseAmount: number, paymentFrequency: 'Monthly' | 'Bi-Weekly' | 'Weekly'): number {
    switch (paymentFrequency) {
      case 'Monthly':
        return this.roundToTwoDecimals(baseAmount * 12);
      case 'Bi-Weekly':
        return this.roundToTwoDecimals(baseAmount * 26); // 52 weeks / 2
      case 'Weekly':
        return this.roundToTwoDecimals(baseAmount * 52);
      default:
        return baseAmount;
    }
  }

  // CALCULATE monthly salary from different payment frequencies
  calculateMonthlySalary(baseAmount: number, paymentFrequency: 'Monthly' | 'Bi-Weekly' | 'Weekly'): number {
    switch (paymentFrequency) {
      case 'Monthly':
        return baseAmount;
      case 'Bi-Weekly':
        return this.roundToTwoDecimals((baseAmount * 26) / 12); // Convert to annual then monthly
      case 'Weekly':
        return this.roundToTwoDecimals((baseAmount * 52) / 12); // Convert to annual then monthly
      default:
        return baseAmount;
    }
  }

  // COMPARE two salaries and calculate percentage change
  calculateSalaryChange(currentSalary: number, previousSalary: number): {
    amountChange: number;
    percentageChange: number;
  } {
    if (previousSalary === 0) {
      return {
        amountChange: currentSalary,
        percentageChange: 100
      };
    }

    const amountChange = currentSalary - previousSalary;
    const percentageChange = (amountChange / previousSalary) * 100;

    return {
      amountChange: this.roundToTwoDecimals(amountChange),
      percentageChange: this.roundToTwoDecimals(percentageChange)
    };
  }

  // PRIVATE method to calculate derived fields for backend submission
  private calculateDerivedFields(salaryData: Partial<Salary>): any {
    const bonus = salaryData.bonus || 0;
    const grossAmount = salaryData.baseAmount! + bonus;
    const taxDeductions = grossAmount * this.TAX_RATE;
    const netAmount = grossAmount - taxDeductions;

    return {
      ...salaryData,
      grossAmount: this.roundToTwoDecimals(grossAmount),
      taxDeductions: this.roundToTwoDecimals(taxDeductions),
      netAmount: this.roundToTwoDecimals(netAmount),
      bonus: bonus
    };
  }

  // PRIVATE helper method to round to 2 decimal places
  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }

  // FORMAT currency for display
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

}