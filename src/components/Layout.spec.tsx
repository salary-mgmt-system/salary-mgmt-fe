import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme';
import Layout from './Layout';
import { describe, it, expect } from 'vitest';

const renderLayout = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          <Layout />
        </StyledThemeProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('Layout Component', () => {
  it('renders branding logo and sidebar navigation links', () => {
    renderLayout();
    expect(screen.getAllByText('SalarySync')[0]).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Dashboard/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Employees/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Insights/ })).toBeInTheDocument();
  });

  it('displays the title of the active route in the app bar', () => {
    renderLayout(['/employees']);
    expect(screen.getByRole('heading', { name: 'Employees' })).toBeInTheDocument();
  });

  it('toggles mobile drawer on clicking hamburger menu and link button', () => {
    renderLayout();
    const toggleBtn = screen.getByRole('button', { name: 'open drawer' });
    expect(toggleBtn).toBeInTheDocument();
    
    // Click to open/toggle
    fireEvent.click(toggleBtn);
    
    // Click a nav link inside the drawer
    const employeesLink = screen.getByRole('link', { name: /Employees/ });
    fireEvent.click(employeesLink);
  });
});
