import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme';
import Dashboard from './Dashboard';
import {
  formatCurrency,
  tickFormatter,
  tooltipSalaryFormatter,
  tooltipCountFormatter,
} from './Dashboard.styles';
import {
  fetchOverviewAnalytics,
  fetchCountryAnalytics,
  fetchDepartmentAnalytics,
  fetchSalaryDistribution,
} from '../api/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../api/api', () => ({
  fetchOverviewAnalytics: vi.fn(),
  fetchCountryAnalytics: vi.fn(),
  fetchDepartmentAnalytics: vi.fn(),
  fetchSalaryDistribution: vi.fn(),
}));

// Mock Recharts to bypass layout measuring dependencies in JSDOM environment
vi.mock('recharts', async (importOriginal) => {
  const original = await importOriginal<typeof import('recharts')>();
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div className="recharts-responsive-container">{children}</div>
    ),
  };
});

const renderDashboard = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          <Dashboard />
        </StyledThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const defaultOverview = {
  employeeCount: 10452,
  averageSalary: 85432,
  medianSalary: 81000,
  highestSalary: 250000,
  lowestSalary: 31500,
};

const defaultCountry = [
  {
    name: 'United States',
    employeeCount: 5,
    averageSalary: 120000,
    medianSalary: 110000,
    highestSalary: 150000,
    lowestSalary: 80000,
  },
  {
    name: 'India',
    employeeCount: 15,
    averageSalary: 950000,
    medianSalary: 900000,
    highestSalary: 1200000,
    lowestSalary: 750000,
  },
];

const defaultDept = [
  {
    name: 'Engineering',
    employeeCount: 12,
    averageSalary: 130000,
    medianSalary: 125000,
    highestSalary: 160000,
    lowestSalary: 90000,
  },
  {
    name: 'HR',
    employeeCount: 4,
    averageSalary: 75000,
    medianSalary: 72000,
    highestSalary: 90000,
    lowestSalary: 60000,
  },
];

const defaultDist = [
  { bracket: '< $80k', count: 120 },
  { bracket: '$80k - $120k', count: 450 },
  { bracket: '$120k - $160k', count: 280 },
];

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchOverviewAnalytics).mockResolvedValue(defaultOverview);
    vi.mocked(fetchCountryAnalytics).mockResolvedValue(defaultCountry);
    vi.mocked(fetchDepartmentAnalytics).mockResolvedValue(defaultDept);
    vi.mocked(fetchSalaryDistribution).mockResolvedValue(defaultDist);
  });

  it('renders welcome heading and subtitle', async () => {
    renderDashboard();

    expect(screen.getByText('Welcome back, HR Manager')).toBeInTheDocument();
    expect(
      screen.getByText('Here is an overview of the organization compensation analytics.')
    ).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    vi.mocked(fetchOverviewAnalytics).mockRejectedValue(new Error('Network error'));

    renderDashboard();

    await waitFor(() => {
      expect(
        screen.getByText(
          'Failed to load compensation analytics. Please verify that the backend is running.'
        )
      ).toBeInTheDocument();
    });
  });

  it('renders dynamic stats with currency formatting and charts when fetch succeeds', async () => {
    renderDashboard();

    // Verify all 5 titles are present
    await waitFor(() => {
      expect(screen.getByText('Total Employees')).toBeInTheDocument();
    });
    expect(screen.getByText('Average Salary')).toBeInTheDocument();
    expect(screen.getByText('Median Salary')).toBeInTheDocument();
    expect(screen.getByText('Highest Salary')).toBeInTheDocument();
    expect(screen.getByText('Lowest Salary')).toBeInTheDocument();

    // Verify formatted values are present
    expect(screen.getByText('10,452')).toBeInTheDocument();
    expect(screen.getByText('$85,432')).toBeInTheDocument();
    expect(screen.getByText('$81,000')).toBeInTheDocument();
    expect(screen.getByText('$250,000')).toBeInTheDocument();
    expect(screen.getByText('$31,500')).toBeInTheDocument();

    // Verify visual chart card titles are displayed
    expect(screen.getByText('Compensation by Country')).toBeInTheDocument();
    expect(screen.getByText('Compensation by Department')).toBeInTheDocument();
    expect(screen.getByText('Organization Salary Distribution')).toBeInTheDocument();
  });

  describe('helper functions', () => {
    it('formatCurrency formats number to USD currency', () => {
      expect(formatCurrency(85432)).toBe('$85,432');
    });

    it('tickFormatter formats number in thousands notation', () => {
      expect(tickFormatter(120000)).toBe('$120k');
    });

    it('tooltipSalaryFormatter formats tooltips to USD', () => {
      expect(tooltipSalaryFormatter(120000)).toEqual(['$120,000', '']);
    });

    it('tooltipCountFormatter formats tooltips to employee counts', () => {
      expect(tooltipCountFormatter(120)).toEqual(['120 Employees', 'Count']);
    });
  });
});
