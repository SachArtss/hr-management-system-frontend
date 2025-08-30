import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CandidateService } from '../../../core/services/candidate.service';
import { DepartmentService } from '../../../core/services/department.service';
import { EmployeeService } from 'src/app/core/services';
import { SalaryService } from 'src/app/core/services';
import { Candidate } from '../../../shared/models/candidate.model';
import { Department } from '../../../shared/models/department.model';
import { Employee } from 'src/app/shared/models';

@Component({
  selector: 'app-hire-candidate',
  templateUrl: './hire-candidate.component.html',
  styleUrls: ['./hire-candidate.component.scss']
})
export class HireCandidateComponent implements OnInit {
  form: FormGroup;
  candidate: Candidate;
  department: Department;
  isLoading = false;
  isHiring = false;
  paymentFrequencies = ['Monthly', 'Bi-Weekly', 'Weekly'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private candidateService: CandidateService,
    private departmentService: DepartmentService,
    private salaryService: SalaryService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      // Personal Information
      dateOfBirth: [''],
      address: [''],
      
      // Emergency Contact
      emergencyContact: [''],
      emergencyContactPhone: [''],
      
      // Salary Information
      baseAmount: [0, [Validators.required, Validators.min(0)]],
      paymentFrequency: ['Monthly', Validators.required],
      effectiveDate: [new Date(), Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCandidate(+id);
    }
  }

  loadCandidate(id: number): void {
    this.isLoading = true;
    this.candidateService.getCandidate(id).subscribe({
      next: (candidate) => {
        this.candidate = candidate;
        if (candidate && candidate.appliedDepartmentId) {
          this.loadDepartment(candidate.appliedDepartmentId);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.showError('Failed to load candidate details');
        this.isLoading = false;
        this.router.navigate(['/candidates']);
      }
    });
  }

  loadDepartment(departmentId: number): void {
    this.departmentService.getDepartment(departmentId).subscribe({
      next: (department) => this.department = department,
      error: (err) => console.error('Failed to load department', err)
    });
  }

  onSubmit(): void {
    if (this.form.valid && this.candidate) {
      this.isHiring = true;
      const formValue = this.form.value;

      const employeeData = {
        name: this.candidate.name,
        phone: this.candidate.phone,
        email: this.candidate.email,
        position: this.candidate.appliedPosition,
        departmentId: this.candidate.appliedDepartmentId,
        dateOfBirth: formValue.dateOfBirth || null,
        address: formValue.address || null,
        emergencyContact: formValue.emergencyContact || null,
        emergencyContactPhone: formValue.emergencyContactPhone || null
      };

      const employeeOperation = this.candidateService.hireCandidate(this.candidate.id, employeeData)
      employeeOperation.subscribe({
        next: (hiredCandidate) => {
          //console.log(hiredCandidate);
          this.showSuccess(hiredCandidate.hiredEmployee.position);
          // Create salary for new employee
          this.createSalaryForEmployee(hiredCandidate.hiredEmployeeId);  
        },
        error: (error) => {
          console.error('Error saving employee:', error);
          this.showError('Failed to create employee with salary record.');
          this.isHiring = false;
        }
      });
    }
  }

  private createSalaryForEmployee(employeeId: number): void {
    const salaryData = {
      employeeId: employeeId,
      baseAmount: this.form.value.baseAmount,
      paymentFrequency: this.form.value.paymentFrequency,
      effectiveDate: new Date(this.form.value.effectiveDate),
      bonus: 0,
      notes: this.form.value.notes
    };

    this.salaryService.addSalary(salaryData).subscribe({
      next: () => {
        this.snackBar.open(
          `Salary has been created!`,
          'Close',
          { duration: 1000, panelClass: ['success-snackbar'] }
        );
        this.router.navigate(['/employees/view', employeeId]);
      },
      error: (error) => {
        console.error('Error creating salary:', error);
        this.showError('Employee created but failed to create salary record');
        this.router.navigate(['/employees']);
      }
    });
  }

  private showSuccess(position: any): void {
    this.snackBar.open(
      `${this.candidate.name} hired successfully as ${position}!`,
      'Close',
      { duration: 5000, panelClass: ['success-snackbar'] }
    );
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 7000,
      panelClass: ['error-snackbar']
    });
  }
}