import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentService } from '../../../core/services/department.service';
import { Department } from '../../../shared/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-department-detail',
  templateUrl: './department-detail.component.html',
  styleUrls: ['./department-detail.component.scss']
})
export class DepartmentDetailComponent implements OnInit {
  department: Department | undefined;
  isLoading = true;
  avatarColor: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.avatarColor = this.getRandomColor();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDepartment(+id);
    }
  }

  loadDepartment(id: number): void {
    this.isLoading = true;
    this.departmentService.getDepartment(id).subscribe({
      next: (department) => {
        this.department = department;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading department:', error);
        this.showError('Failed to load department details');
        this.isLoading = false;
        this.router.navigate(['/departments']);
      }
    });
  }

  onEdit(): void {
    if (this.department) {
      this.router.navigate(['/departments/edit', this.department.id]);
    }
  }

  onAddEmployee(): void {
    this.router.navigate(['/employees/new'], { 
      queryParams: { departmentId: (this.department&& this.department.id? this.department.id: null) } 
    });
  }

  onViewEmployee(employeeId: number): void {
    this.router.navigate(['/employees/view', employeeId]);
  }

  onDelete(): void {
    if (this.department) {
      // Check if department has employees
      if (this.department.employees && this.department.employees.length > 0) {
        this.showError('Cannot delete department with employees. Please reassign or remove employees first.');
        return;
      }

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          title: 'Confirm Delete',
          message: 'Are you sure you want to delete this department? This action cannot be undone.',
          confirmText: 'Delete',
          cancelText: 'Cancel'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.departmentService.deleteDepartment(this.department!.id).subscribe({
            next: () => {
              this.snackBar.open('Department deleted successfully', 'Close', { duration: 3000 });
              this.router.navigate(['/departments']);
            },
            error: (error) => {
              console.error('Error deleting department:', error);
              this.showError('Failed to delete department');
            }
          });
        }
      });
    }
  }

  getRandomColor(): string {
    const colors = [
      '#3F51B5', '#673AB7', '#009688', '#FF5722', 
      '#E91E63', '#00BCD4', '#8BC34A', '#795548'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  formatBudget(budget?: number): string {
    if (!budget) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(budget);
  }

  getActiveEmployeesCount(): number {
    return this.department && this.department.employees
      ? this.department.employees.filter(emp => emp.status === 'Active' || !emp.status).length
      : 0;
  }


  getEmployeeCountText(): string {
    const count = this.department && this.department.employees
      ? this.department.employees.length
      : 0;    
    return `${count} employee${count !== 1 ? 's' : ''}`;
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}