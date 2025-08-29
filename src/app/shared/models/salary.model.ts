export interface Salary {
  id: number;
  employeeId: number;
  baseAmount: number;
  bonus?: number;
  grossAmount?: number;      // Calculated by backend
  taxDeductions?: number;    // Calculated by backend
  netAmount?: number;        // Calculated by backend
  paymentFrequency: 'Monthly' | 'Bi-Weekly' | 'Weekly';
  effectiveDate: Date;
  previousSalaryId?: number;
  adjustmentType?: 'raise' | 'bonus' | 'correction';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional - backend may include these)
  employee?: {
    id: number;
    name: string;
    email: string;
    position?: string;
    department?: {
      id: number;
      name: string;
    };
  };
  previousSalary?: {
    id: number;
    baseAmount: number;
    effectiveDate: Date;
  };
}