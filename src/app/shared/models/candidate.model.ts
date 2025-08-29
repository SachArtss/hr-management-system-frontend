export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  appliedPosition: string;
  appliedDepartmentId?: number;
  resume?: string;
  status: 'Applied' | 'Interviewed' | 'Hired' | 'Rejected';
  applicationDate: Date;
  createdAt: Date;
  updatedAt: Date;
  hiredEmployeeId?: number;
  
  // Relations (optional - backend may include these)
  department?: {
    id: number;
    name: string;
    location: string;
  };
  hiredEmployee?: {
    id: number;
    name: string;
    position: string;
  };
}