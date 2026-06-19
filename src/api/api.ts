export interface Salary {
  id: string;
  employeeId: string;
  baseSalary: number;
  bonus: number;
  effectiveDate: string;
  isCurrent: boolean;
  createdAt: string;
}

export interface SalaryHistory {
  id: string;
  employeeId: string;
  oldSalary: number;
  newSalary: number;
  reason: string;
  changedAt: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  country: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  salaries?: Salary[];
}

export interface GetEmployeesParams {
  page: number;
  pageSize: number;
  search?: string;
  department?: string;
  country?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface GetEmployeesResponse {
  data: Employee[];
  total: number;
  page: number;
}

export interface GetEmployeeDetailsResponse {
  employee: Employee;
  currentSalary: Salary | null;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000/api';

export async function fetchEmployees(params: GetEmployeesParams): Promise<GetEmployeesResponse> {
  const url = new URL(`${API_BASE_URL}/employees`);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.append(key, String(val));
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch employees: ${res.statusText}`);
  }
  return res.json() as Promise<GetEmployeesResponse>;
}

export async function fetchEmployeeDetails(id: string): Promise<GetEmployeeDetailsResponse> {
  const res = await fetch(`${API_BASE_URL}/employees/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch employee details: ${res.statusText}`);
  }
  return res.json() as Promise<GetEmployeeDetailsResponse>;
}

export async function fetchSalaryHistory(id: string): Promise<SalaryHistory[]> {
  const res = await fetch(`${API_BASE_URL}/employees/${id}/salary-history`);
  if (!res.ok) {
    throw new Error(`Failed to fetch salary history: ${res.statusText}`);
  }
  return res.json() as Promise<SalaryHistory[]>;
}
