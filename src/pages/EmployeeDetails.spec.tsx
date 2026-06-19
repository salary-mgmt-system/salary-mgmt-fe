import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme';
import EmployeeDetails from './EmployeeDetails';
import { fetchEmployeeDetails } from '../api/api';
import type { GetEmployeeDetailsResponse } from '../api/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../api/api', () => ({
  fetchEmployeeDetails: vi.fn(),
}));

const mockEmployeeDetails = {
  employee: {
    id: 'emp-1',
    employeeCode: 'EMP001',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    department: 'Engineering',
    designation: 'Senior Engineer',
    country: 'United States',
    currency: 'USD',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  currentSalary: {
    id: 'sal-1',
    employeeId: 'emp-1',
    baseSalary: 120000,
    bonus: 15000,
    effectiveDate: '2026-01-01',
    isCurrent: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
};

const renderEmployeeDetails = (employeeId = 'emp-1') => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/employees/${employeeId}`]}>
        <ThemeProvider theme={theme}>
          <StyledThemeProvider theme={theme}>
            <Routes>
              <Route path="/employees/:id" element={<EmployeeDetails />} />
            </Routes>
          </StyledThemeProvider>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('EmployeeDetails Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('displays loading skeletons while fetching details', () => {
    vi.mocked(fetchEmployeeDetails).mockReturnValueOnce(new Promise(() => {})); // Never resolves
    renderEmployeeDetails();
    expect(screen.getByRole('link', { name: 'Back to Directory' })).toBeInTheDocument();
  });

  it('renders employee information and current compensation details', async () => {
    vi.mocked(fetchEmployeeDetails).mockResolvedValueOnce(mockEmployeeDetails);
    renderEmployeeDetails();

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('EMP001')).toBeInTheDocument();
      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
      expect(screen.getByText('United States (USD)')).toBeInTheDocument();
      expect(screen.getByText('Engineering')).toBeInTheDocument();
      expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
      
      // Compensation panel
      expect(screen.getByText('Current Compensation')).toBeInTheDocument();
      expect(screen.getByText('$120,000.00')).toBeInTheDocument();
      expect(screen.getByText('+ $15,000.00')).toBeInTheDocument();
      expect(screen.getByText('$135,000.00')).toBeInTheDocument();
      expect(screen.getByText('2026-01-01')).toBeInTheDocument();
    });
  });

  it('displays error alert on fetch failure', async () => {
    vi.mocked(fetchEmployeeDetails).mockRejectedValueOnce(new Error('Record not found'));
    renderEmployeeDetails();

    await waitFor(() => {
      expect(screen.getByText('Error loading employee details: Record not found')).toBeInTheDocument();
    });
  });

  it('renders custom currency string when currency code is invalid', async () => {
    vi.mocked(fetchEmployeeDetails).mockResolvedValueOnce({
      employee: {
        ...mockEmployeeDetails.employee,
        currency: 'INVALID_CURR',
      },
      currentSalary: mockEmployeeDetails.currentSalary,
    });

    renderEmployeeDetails();

    await waitFor(() => {
      expect(screen.getByText('INVALID_CURR 120000.00')).toBeInTheDocument();
      expect(screen.getByText('+ INVALID_CURR 15000.00')).toBeInTheDocument();
      expect(screen.getByText('INVALID_CURR 135000.00')).toBeInTheDocument();
    });
  });

  it('renders message when no active salary record exists', async () => {
    vi.mocked(fetchEmployeeDetails).mockResolvedValueOnce({
      employee: mockEmployeeDetails.employee,
      currentSalary: null,
    });

    renderEmployeeDetails();

    await waitFor(() => {
      expect(screen.getByText('No active salary record exists for this employee.')).toBeInTheDocument();
    });
  });

  it('displays warning when employee is not found', async () => {
    vi.mocked(fetchEmployeeDetails).mockResolvedValueOnce({
      employee: null,
      currentSalary: null,
    } as unknown as GetEmployeeDetailsResponse);

    renderEmployeeDetails();

    await waitFor(() => {
      expect(screen.getByText('Employee not found.')).toBeInTheDocument();
    });
  });

  it('displays a generic error alert on non-Error rejection', async () => {
    vi.mocked(fetchEmployeeDetails).mockRejectedValueOnce('Some rejection message');
    renderEmployeeDetails();

    await waitFor(() => {
      expect(screen.getByText('Error loading employee details: Unknown error')).toBeInTheDocument();
    });
  });

  it('handles rendering without id param', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/employees']}>
          <ThemeProvider theme={theme}>
            <StyledThemeProvider theme={theme}>
              <Routes>
                <Route path="/employees" element={<EmployeeDetails />} />
              </Routes>
            </StyledThemeProvider>
          </ThemeProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Employee not found.')).toBeInTheDocument();
    });
  });
});
