import { render, screen } from '@testing-library/react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme';
import Dashboard from './Dashboard';
import { describe, it, expect } from 'vitest';

const renderDashboard = () => {
  return render(
    <ThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <Dashboard />
      </StyledThemeProvider>
    </ThemeProvider>
  );
};

describe('Dashboard Component', () => {
  it('renders welcome heading and subtitle', () => {
    renderDashboard();
    expect(screen.getByText('Welcome back, HR Manager')).toBeInTheDocument();
    expect(screen.getByText('Here is an overview of the organization compensation analytics.')).toBeInTheDocument();
  });

  it('renders stat cards with correct titles and mock values', () => {
    renderDashboard();
    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('10,000')).toBeInTheDocument();

    expect(screen.getByText('Average Salary')).toBeInTheDocument();
    expect(screen.getByText('$85,400')).toBeInTheDocument();

    expect(screen.getByText('Highest Salary')).toBeInTheDocument();
    expect(screen.getByText('$240,000')).toBeInTheDocument();

    expect(screen.getByText('Lowest Salary')).toBeInTheDocument();
    expect(screen.getByText('$32,000')).toBeInTheDocument();
  });
});
