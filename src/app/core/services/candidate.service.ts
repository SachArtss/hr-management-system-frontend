import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate, Employee } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = `${environment.apiUrl}/candidates`;

  constructor(private http: HttpClient) { }

  // GET all candidates
  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl);
  }

  // GET single candidate by ID
  getCandidate(id: number): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/${id}`);
  }

  // GET candidates by department
  getCandidatesByDepartment(departmentId: number): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.apiUrl}/department/${departmentId}`);
  }

  // GET candidates by status
  getCandidatesByStatus(status: string): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.apiUrl}/status/${status}`);
  }

  // SEARCH candidates
  searchCandidates(term: string): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.apiUrl}/search`, {
      params: { q: term }
    });
  }

  // POST create new candidate
  addCandidate(candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Observable<Candidate> {
    return this.http.post<Candidate>(this.apiUrl, candidate);
  }

  // PUT update candidate
  updateCandidate(candidate: Candidate): Observable<Candidate> {
    return this.http.patch<Candidate>(`${this.apiUrl}/${candidate.id}`, candidate);
  }

  // PATCH update candidate status
  updateCandidateStatus(id: number, status: string): Observable<Candidate> {
    return this.http.patch<Candidate>(`${this.apiUrl}/${id}/status`, { status });
  }

  // DELETE candidate
  deleteCandidate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // POST hire candidate (creates employee and updates candidate)
  hireCandidate(candidateId: number, employeeData: {
    name: string,
    phone: string,
    email: string,
    position: string;
    departmentId: number,
    dateOfBirth: Date;
    address: string;
    emergencyContact: string;
    emergencyContactPhone: string;
  }): Observable<Candidate> {
    return this.http.post<Candidate>(`${this.apiUrl}/${candidateId}/hire`, employeeData);
  }
}