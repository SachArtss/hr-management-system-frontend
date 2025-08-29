export interface Employee {
  id: number;
  name: string;
  email: string;
  departmentId?: number;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: Date;
  position?: string;
  hireDate?: Date;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  employmentType?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Optional relations for frontend display
  department?: {
    id: number;
    name: string;
  };
  salaries?: Array<{
    id: number;
    baseAmount: number;
    effectiveDate: Date;
  }>;
}