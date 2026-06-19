import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme';
import Employees from './Employees';
import { fetchEmployees } from '../api/api';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom') as typeof import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../api/api', () => ({
  fetchEmployees: vi.fn(),
}));

const mockEmployeesData = {
  data: [
    {
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
      salaries: [{ baseSalary: 120000, bonus: 15000, isCurrent: true, id: 'sal-1', employeeId: 'emp-1', effectiveDate: '2026-01-01', createdAt: '2026-01-01' }],
    },
  ],
  total: 100, // 100 records for pagination testing
  page: 1,
};

const renderEmployees = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <StyledThemeProvider theme={theme}>
            <Employees />
          </StyledThemeProvider>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Employees Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders employee listing header and search box', async () => {
    vi.mocked(fetchEmployees).mockResolvedValueOnce(mockEmployeesData);
    renderEmployees();

    expect(screen.getByText('Employee Directory')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search name, code, email...')).toBeInTheDocument();
  });

  it('displays loading skeletons while fetching data', () => {
    vi.mocked(fetchEmployees).mockReturnValueOnce(new Promise(() => {})); // Never resolves
    renderEmployees();
    expect(screen.getAllByRole('row')).toHaveLength(11); // 1 head row + 10 skeleton rows
  });

  it('renders employee records when fetch succeeds', async () => {
    vi.mocked(fetchEmployees).mockResolvedValueOnce(mockEmployeesData);
    renderEmployees();

    await waitFor(() => {
      expect(screen.getByText('EMP001')).toBeInTheDocument();
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
      expect(screen.getByText('Engineering')).toBeInTheDocument();
      expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
      expect(screen.getByText('United States')).toBeInTheDocument();
    });
  });

  it('displays an error alert when fetch fails', async () => {
    vi.mocked(fetchEmployees).mockRejectedValueOnce(new Error('Network Error'));
    renderEmployees();

    await waitFor(() => {
      expect(screen.getByText('Error loading employees: Network Error')).toBeInTheDocument();
    });
  });

  it('updates search query with debounce', async () => {
    vi.mocked(fetchEmployees).mockResolvedValue(mockEmployeesData);
    vi.useFakeTimers();
    renderEmployees();

    const searchInput = screen.getByPlaceholderText('Search name, code, email...');
    fireEvent.change(searchInput, { target: { value: 'Bob' } });

    // Verify it doesn't trigger fetch immediately
    expect(fetchEmployees).not.toHaveBeenCalledWith(expect.objectContaining({ search: 'Bob' }));

    // Fast-forward debounce timeout
    act(() => {
      vi.advanceTimersByTime(500);
    });

    vi.useRealTimers();

    await waitFor(() => {
      expect(fetchEmployees).toHaveBeenCalledWith(expect.objectContaining({ search: 'Bob', page: 1 }));
    });
  });

  it('filters by department and country', async () => {
    vi.mocked(fetchEmployees).mockResolvedValue(mockEmployeesData);
    renderEmployees();

    await waitFor(() => {
      expect(screen.getByText('EMP001')).toBeInTheDocument();
    });

    // Trigger Department filter change
    const departmentInput = document.querySelector('input[name="department"]') as HTMLInputElement;
    if (departmentInput) {
      fireEvent.change(departmentInput, { target: { value: 'Engineering' } });
    }

    await waitFor(() => {
      expect(fetchEmployees).toHaveBeenCalledWith(expect.objectContaining({ department: 'Engineering', page: 1 }));
    });

    // Trigger Country filter change
    const countryInput = document.querySelector('input[name="country"]') as HTMLInputElement;
    if (countryInput) {
      fireEvent.change(countryInput, { target: { value: 'India' } });
    }

    await waitFor(() => {
      expect(fetchEmployees).toHaveBeenCalledWith(expect.objectContaining({ country: 'India', page: 1 }));
    });
  });

  it('triggers sorting when column headers are clicked', async () => {
    vi.mocked(fetchEmployees).mockResolvedValue(mockEmployeesData);
    renderEmployees();

    await waitFor(() => {
      expect(screen.getByText('EMP001')).toBeInTheDocument();
    });

    const codeHeader = screen.getByText('Code');
    fireEvent.click(codeHeader);

    await waitFor(() => {
      // Toggle sortOrder ASC -> DESC
      expect(fetchEmployees).toHaveBeenCalledWith(expect.objectContaining({ sortBy: 'employeeCode', sortOrder: 'DESC' }));
    });

    // Toggle sortOrder DESC -> ASC
    fireEvent.click(codeHeader);

    await waitFor(() => {
      expect(fetchEmployees).toHaveBeenCalledWith(expect.objectContaining({ sortBy: 'employeeCode', sortOrder: 'ASC' }));
    });

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);

    await waitFor(() => {
      expect(fetchEmployees).toHaveBeenCalledWith(expect.objectContaining({ sortBy: 'firstName', sortOrder: 'ASC' }));
    });
  });

  it('navigates to details page when a row is clicked', async () => {
    vi.mocked(fetchEmployees).mockResolvedValueOnce(mockEmployeesData);
    renderEmployees();

    await waitFor(() => {
      expect(screen.getByText('EMP001')).toBeInTheDocument();
    });

    const row = screen.getByText('EMP001').closest('tr');
    expect(row).toBeInTheDocument();
    fireEvent.click(row!);

    expect(mockNavigate).toHaveBeenCalledWith('/employees/emp-1');
  });

  it('handles pagination changes', async () => {
    vi.mocked(fetchEmployees).mockResolvedValue(mockEmployeesData);
    renderEmployees();

    await waitFor(() => {
      expect(screen.getByText('EMP001')).toBeInTheDocument();
    });

    // Click Next Page button
    const nextPageButton = screen.getByRole('button', { name: /Go to next page/i });
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(fetchEmployees).toHaveBeenCalledWith(expect.objectContaining({ page: 2 }));
    });

    // Change rows per page using select
    const select = document.querySelector('select') as HTMLSelectElement;
    if (select) {
      fireEvent.change(select, { target: { value: 25 } });
    }

    await waitFor(() => {
      expect(fetchEmployees).toHaveBeenCalledWith(expect.objectContaining({ pageSize: 25, page: 1 }));
    });
  });

  it('displays empty state when no employees are found', async () => {
    vi.mocked(fetchEmployees).mockResolvedValueOnce({
      data: [],
      total: 0,
      page: 1,
    });
    renderEmployees();

    await waitFor(() => {
      expect(screen.getByText('No employees found.')).toBeInTheDocument();
    });
  });

  it('renders fallback values for missing salaries and invalid currency format', async () => {
    vi.mocked(fetchEmployees).mockResolvedValueOnce({
      data: [
        {
          id: 'emp-2',
          employeeCode: 'EMP002',
          firstName: 'Bob',
          lastName: 'Jones',
          email: 'bob@example.com',
          department: 'Marketing',
          designation: 'Manager',
          country: 'Germany',
          currency: 'USD',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          salaries: [], // Empty salaries to trigger "N/A" fallback
        },
        {
          id: 'emp-3',
          employeeCode: 'EMP003',
          firstName: 'Charlie',
          lastName: 'Brown',
          email: 'charlie@example.com',
          department: 'HR',
          designation: 'Specialist',
          country: 'Germany',
          currency: 'INVALID_CURR', // Invalid currency to trigger catch block in formatCurrency
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          salaries: [{ baseSalary: 85000, bonus: 7500, isCurrent: true, id: 'sal-3', employeeId: 'emp-3', effectiveDate: '2026-01-01', createdAt: '2026-01-01' }],
        },
      ],
      total: 2,
      page: 1,
    });

    renderEmployees();

    await waitFor(() => {
      expect(screen.getByText('EMP002')).toBeInTheDocument();
      expect(screen.getByText('EMP003')).toBeInTheDocument();
    });

    // Check N/A displays for empty salary
    expect(screen.getAllByText('N/A')).toHaveLength(2); // one for base salary, one for bonus

    // Check custom formatting fallback string for invalid currency
    expect(screen.getByText('INVALID_CURR 85000.00')).toBeInTheDocument();
    expect(screen.getByText('INVALID_CURR 7500.00')).toBeInTheDocument();
  });

  it('displays a generic error alert when fetch fails with a non-Error object', async () => {
    vi.mocked(fetchEmployees).mockRejectedValueOnce('String Error Object');
    renderEmployees();

    await waitFor(() => {
      expect(screen.getByText('Error loading employees: Unknown error')).toBeInTheDocument();
    });
  });
});
