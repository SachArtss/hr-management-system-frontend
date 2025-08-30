import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../core/services/employee.service';
import { DepartmentService } from '../../../core/services/department.service';
import { SalaryService } from '../../../core/services/salary.service';
import { Employee, Department } from '../../../shared/models';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  form: FormGroup;
  salaryForm: FormGroup;
  departments: Department[] = [];
  isEditMode = false;
  isLoading = false;
  showSalarySection = false;

  // Salary frequency options
  paymentFrequencies = ['Monthly', 'Bi-Weekly', 'Weekly'];
  employmentTypes = ['Full-Time', 'Part-Time', 'Contract'];
  statusOptions = ['Active', 'On-Leave', 'Terminated'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private salaryService: SalaryService,
    private route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      departmentId: [null],
      
      // Personal Information
      phoneNumber: [''],
      address: [''],
      dateOfBirth: [''],
      
      // Employment Information
      position: [''],
      hireDate: [new Date(), Validators.required],
      
      // Additional Information
      emergencyContact: [''],
      emergencyContactPhone: [''],
      employmentType: ['Full-Time'],
      status: ['Active']
    });

    this.salaryForm = this.fb.group({
      baseAmount: [0, [Validators.required, Validators.min(0)]],
      paymentFrequency: ['Monthly', Validators.required],
      effectiveDate: [new Date(), Validators.required],
      bonus: [0, [Validators.min(0)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadDepartments();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadEmployee(+id);
    } else {
      // Show salary section only for new employees
      this.showSalarySection = true;
    }
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => this.departments = departments,
      error: (error) => {
        console.error('Error loading departments:', error);
        this.showError('Failed to load departments');
      }
    });
  }

  loadEmployee(id: number): void {
    this.isLoading = true;
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        this.form.patchValue({
          ...employee,
          dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : null,
          hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : null
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employee:', error);
        this.showError('Failed to load employee');
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid && (!this.showSalarySection || this.salaryForm.valid)) {
      this.isLoading = true;
      
      // Prepare employee data
      const employeeData = {
        ...this.form.value,
        dateOfBirth: this.form.value.dateOfBirth ? new Date(this.form.value.dateOfBirth) : null,
        hireDate: new Date(this.form.value.hireDate)
      };

      const employeeOperation = this.isEditMode
        ? this.employeeService.updateEmployee({ 
            id: +this.route.snapshot.paramMap.get('id')!, 
            ...employeeData 
          })
        : this.employeeService.addEmployee(employeeData);

      employeeOperation.subscribe({
        next: (savedEmployee) => {
          if (!this.isEditMode && this.showSalarySection) {
            // Create salary for new employee
            this.createSalaryForEmployee(savedEmployee);
          } else {
            this.showSuccess();
            this.router.navigate(['/employees']);
          }
        },
        error: (error) => {
          console.error('Error saving employee:', error);
          this.showError(`Failed to ${this.isEditMode ? 'update' : 'add'} employee`);
          this.isLoading = false;
        }
      });
    }
  }

  private createSalaryForEmployee(employee: Employee): void {
    const salaryData = {
      employeeId: employee.id,
      baseAmount: this.salaryForm.value.baseAmount,
      paymentFrequency: this.salaryForm.value.paymentFrequency,
      effectiveDate: new Date(this.salaryForm.value.effectiveDate),
      bonus: this.salaryForm.value.bonus,
      notes: this.salaryForm.value.notes
    };

    this.salaryService.addSalary(salaryData).subscribe({
      next: () => {
        this.showSuccess();
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        console.error('Error creating salary:', error);
        this.showError('Employee created but failed to create salary record');
        this.router.navigate(['/employees']);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private showSuccess(): void {
    this.snackBar.open(
      `Employee ${this.isEditMode ? 'updated' : 'added'} successfully!`,
      'Close',
      { duration: 3000 }
    );
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  // Helper method to format date for display
  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }
}