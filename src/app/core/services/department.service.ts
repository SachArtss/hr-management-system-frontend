import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = `${environment.apiUrl}/departments`;

  constructor(private http: HttpClient) { }

  // GET all departments
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  // GET single department by ID
  getDepartment(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }

  // POST create new department
  addDepartment(department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department);
  }

  // PUT update existing department
  updateDepartment(department: Department): Observable<Department> {
    return this.http.patch<Department>(`${this.apiUrl}/${department.id}`, department);
  }

  // DELETE department
  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // GET departments with manager details
  getDepartmentsWithManagers(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/with-managers`);
  }

  // GET department statistics
  getDepartmentStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  // SEARCH departments by name
  searchDepartments(term: string): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/search`, {
      params: { q: term }
    });
  }
}