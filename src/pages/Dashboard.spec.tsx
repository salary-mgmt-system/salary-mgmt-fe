import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme';
import Dashboard from './Dashboard';
import { fetchOverviewAnalytics } from '../api/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../api/api', () => ({
  fetchOverviewAnalytics: vi.fn(),
}));

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

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders welcome heading and subtitle', async () => {
    vi.mocked(fetchOverviewAnalytics).mockResolvedValueOnce({
      employeeCount: 150,
      averageSalary: 75000,
      medianSalary: 70000,
      highestSalary: 120000,
      lowestSalary: 45000,
    });

    renderDashboard();

    expect(screen.getByText('Welcome back, HR Manager')).toBeInTheDocument();
    expect(
      screen.getByText('Here is an overview of the organization compensation analytics.')
    ).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    vi.mocked(fetchOverviewAnalytics).mockRejectedValueOnce(new Error('Network error'));

    renderDashboard();

    await waitFor(() => {
      expect(
        screen.getByText(
          'Failed to load compensation overview analytics. Please verify that the backend is running.'
        )
      ).toBeInTheDocument();
    });
  });

  it('renders dynamic stats with currency formatting when fetch succeeds', async () => {
    vi.mocked(fetchOverviewAnalytics).mockResolvedValueOnce({
      employeeCount: 10452,
      averageSalary: 85432,
      medianSalary: 81000,
      highestSalary: 250000,
      lowestSalary: 31500,
    });

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
  });
});
