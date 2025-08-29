export interface Department {
  id: number;
  name: string;
  location: string;
  budget?: number;
  managerId?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional - backend may include these)
  manager?: {
    id: number;
    name: string;
    email: string;
    position?: string;
  };
  employees?: Array<{
    id: number;
    name: string;
    position?: string;
    status?: string;
  }>;
  candidates?: Array<{
    id: number;
    name: string;
    appliedPosition: string;
    status: string;
  }>;
  
  // Statistics (optional - for frontend display)
  employeeCount?: number;
  candidateCount?: number;
}