import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) { }

  // CREATE - Add new employee
  addEmployee(employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  // READ - Get all employees with department info
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  // READ - Get single employee by ID with full details
  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  // UPDATE - Update existing employee
  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/${employee.id}`, employee);
  }

  // DELETE - Remove employee
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // SEARCH - Search employees by various criteria
  searchEmployees(term: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/search`, {
      params: { q: term }
    });
  }

  // GET BY DEPARTMENT - Get employees filtered by department
  getEmployeesByDepartment(departmentId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/department/${departmentId}`);
  }

  // GET MANAGERS - Get employees who are department managers
  getManagers(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/managers`);
  }

  // UPDATE STATUS - Update employee status (Active/Inactive)
  updateEmployeeStatus(id: number, status: string): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/${id}`, { status });
  }
}