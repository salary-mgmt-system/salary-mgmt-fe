import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme';
import EmployeeDetails from './EmployeeDetails';
import { fetchEmployeeDetails, fetchSalaryHistory } from '../api/api';
import type { GetEmployeeDetailsResponse } from '../api/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../api/api', () => ({
  fetchEmployeeDetails: vi.fn(),
  fetchSalaryHistory: vi.fn(),
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

const mockSalaryHistory = [
  {
    id: 'sh-1',
    employeeId: 'emp-1',
    oldSalary: 110000,
    newSalary: 120000,
    reason: 'Annual performance review',
    changedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'sh-2',
    employeeId: 'emp-1',
    oldSalary: 100000,
    newSalary: 110000,
    reason: 'Promotion to Level 2',
    changedAt: '2025-06-01T00:00:00.000Z',
  },
  {
    id: 'sh-3',
    employeeId: 'emp-1',
    oldSalary: 120000,
    newSalary: 115000,
    reason: 'Demotion / Restructuring',
    changedAt: '2024-12-01T00:00:00.000Z',
  },
  {
    id: 'sh-4',
    employeeId: 'emp-1',
    oldSalary: 0,
    newSalary: 100000,
    reason: 'Initial onboarding salary',
    changedAt: '2024-01-01T00:00:00.000Z',
  },
];

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
    vi.mocked(fetchSalaryHistory).mockResolvedValue([]);
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

  describe('Salary History Timeline', () => {
    it('displays loading skeletons while fetching history list', async () => {
      vi.mocked(fetchEmployeeDetails).mockResolvedValueOnce(mockEmployeeDetails);
      vi.mocked(fetchSalaryHistory).mockReturnValueOnce(new Promise(() => {})); // Never resolves
      renderEmployeeDetails();

      await waitFor(() => {
        expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      });
      expect(screen.getByTestId('timeline-loading')).toBeInTheDocument();
    });

    it('renders a list of history records when API resolves with logs', async () => {
      vi.mocked(fetchEmployeeDetails).mockResolvedValueOnce(mockEmployeeDetails);
      vi.mocked(fetchSalaryHistory).mockResolvedValueOnce(mockSalaryHistory);
      renderEmployeeDetails();

      await waitFor(() => {
        expect(screen.getByTestId('timeline-container')).toBeInTheDocument();
        const items = screen.getAllByTestId('timeline-item');
        expect(items.length).toBe(4);

        // Verification of contents of the first change item
        const elements110k = screen.getAllByText('$110,000.00');
        expect(elements110k.length).toBe(2);
        const elements120k = screen.getAllByText('$120,000.00');
        expect(elements120k.length).toBe(3);
        expect(screen.getByText('+$10,000.00 (+9.1%)')).toBeInTheDocument();
        expect(screen.getByText(/Annual performance review/)).toBeInTheDocument();

        // Verification of contents of the second change item
        const elements100k = screen.getAllByText('$100,000.00');
        expect(elements100k.length).toBe(2);
        expect(screen.getByText('+$10,000.00 (+10.0%)')).toBeInTheDocument();
        expect(screen.getByText(/Promotion to Level 2/)).toBeInTheDocument();

        // Verification of contents of the third change item (decrease)
        expect(screen.getByText('$115,000.00')).toBeInTheDocument();
        expect(screen.getByText('-$5,000.00 (-4.2%)')).toBeInTheDocument();
        expect(screen.getByText(/Demotion \/ Restructuring/)).toBeInTheDocument();

        // Verification of contents of the fourth change item (zero old salary)
        expect(screen.getByText('$0.00')).toBeInTheDocument();
        expect(screen.getByText('+$100,000.00')).toBeInTheDocument();
        expect(screen.getByText(/Initial onboarding salary/)).toBeInTheDocument();
      });
    });

    it('displays a fallback message when there are no history records', async () => {
      vi.mocked(fetchEmployeeDetails).mockResolvedValueOnce(mockEmployeeDetails);
      vi.mocked(fetchSalaryHistory).mockResolvedValueOnce([]);
      renderEmployeeDetails();

      await waitFor(() => {
        expect(screen.getByTestId('no-timeline-data')).toBeInTheDocument();
        expect(
          screen.getByText('No previous salary changes recorded for this employee.')
        ).toBeInTheDocument();
      });
    });

    it('displays fallback when history api fails', async () => {
      vi.mocked(fetchEmployeeDetails).mockResolvedValueOnce(mockEmployeeDetails);
      vi.mocked(fetchSalaryHistory).mockRejectedValueOnce(new Error('History failed'));
      renderEmployeeDetails();

      await waitFor(() => {
        expect(screen.getByTestId('no-timeline-data')).toBeInTheDocument();
      });
    });

    it('handles timeline date string parsing failure safely', async () => {
      vi.mocked(fetchEmployeeDetails).mockResolvedValueOnce(mockEmployeeDetails);
      vi.mocked(fetchSalaryHistory).mockResolvedValueOnce([
        {
          id: 'sh-bad-date',
          employeeId: 'emp-1',
          oldSalary: 110000,
          newSalary: 120000,
          reason: 'Review',
          changedAt: 'invalid-date-string',
        },
      ]);
      renderEmployeeDetails();

      await waitFor(() => {
        expect(screen.getByText('invalid-date-string')).toBeInTheDocument();
      });
    });
  });
});
