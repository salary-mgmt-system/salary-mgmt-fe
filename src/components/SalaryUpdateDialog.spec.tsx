import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme';
import SalaryUpdateDialog from './SalaryUpdateDialog';
import { updateSalary } from '../api/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../api/api', () => ({
  updateSalary: vi.fn(),
}));

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  onSuccess: vi.fn(),
  employeeId: 'emp-1',
  employeeName: 'Alice Smith',
  currency: 'USD',
  currentBaseSalary: 120000,
  currentBonus: 15000,
};

const renderDialog = (overrides = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const props = { ...defaultProps, ...overrides };
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          <SalaryUpdateDialog {...props} />
        </StyledThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('SalaryUpdateDialog', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the dialog with form fields and pre-filled values', () => {
    renderDialog();

    expect(screen.getByRole('heading', { name: 'Update Salary' })).toBeInTheDocument();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByTestId('base-salary-input')).toHaveValue(120000);
    expect(screen.getByTestId('bonus-input')).toHaveValue(15000);
    expect(screen.getByTestId('effective-date-input')).toHaveValue('');
    expect(screen.getByTestId('reason-input')).toHaveValue('');
    expect(screen.getByTestId('salary-update-submit')).toBeInTheDocument();
    expect(screen.getByTestId('salary-update-cancel')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    renderDialog({ open: false });
    expect(screen.queryByRole('heading', { name: 'Update Salary' })).not.toBeInTheDocument();
  });

  it('shows validation errors on empty required fields', async () => {
    const user = userEvent.setup();
    renderDialog();

    // Clear pre-filled values
    const baseSalaryInput = screen.getByTestId('base-salary-input');
    const bonusInput = screen.getByTestId('bonus-input');
    await user.clear(baseSalaryInput);
    await user.clear(bonusInput);

    await user.click(screen.getByTestId('salary-update-submit'));

    await waitFor(() => {
      expect(screen.getByText('Base salary is required')).toBeInTheDocument();
      expect(screen.getByText('Bonus is required')).toBeInTheDocument();
      expect(screen.getByText('Effective date is required')).toBeInTheDocument();
      expect(screen.getByText('Reason is required')).toBeInTheDocument();
    });

    expect(updateSalary).not.toHaveBeenCalled();
  });

  it('shows validation error for negative base salary', async () => {
    const user = userEvent.setup();
    renderDialog();

    const baseSalaryInput = screen.getByTestId('base-salary-input');
    await user.clear(baseSalaryInput);
    await user.type(baseSalaryInput, '-1000');

    const effectiveDateInput = screen.getByTestId('effective-date-input');
    await user.type(effectiveDateInput, '2026-07-01');

    const reasonInput = screen.getByTestId('reason-input');
    await user.type(reasonInput, 'Some reason');

    await user.click(screen.getByTestId('salary-update-submit'));

    await waitFor(() => {
      expect(screen.getByText('Base salary must be non-negative')).toBeInTheDocument();
    });
  });

  it('shows validation error for negative bonus', async () => {
    const user = userEvent.setup();
    renderDialog();

    const bonusInput = screen.getByTestId('bonus-input');
    await user.clear(bonusInput);
    await user.type(bonusInput, '-500');

    const effectiveDateInput = screen.getByTestId('effective-date-input');
    await user.type(effectiveDateInput, '2026-07-01');

    const reasonInput = screen.getByTestId('reason-input');
    await user.type(reasonInput, 'Some reason');

    await user.click(screen.getByTestId('salary-update-submit'));

    await waitFor(() => {
      expect(screen.getByText('Bonus must be non-negative')).toBeInTheDocument();
    });
  });

  it('calls updateSalary API and triggers success flow on valid submission', async () => {
    const user = userEvent.setup();
    vi.mocked(updateSalary).mockResolvedValueOnce({
      employee: { id: 'emp-1' } as never,
      currentSalary: { baseSalary: 130000 } as never,
    });

    renderDialog();

    const baseSalaryInput = screen.getByTestId('base-salary-input');
    await user.clear(baseSalaryInput);
    await user.type(baseSalaryInput, '130000');

    const effectiveDateInput = screen.getByTestId('effective-date-input');
    await user.type(effectiveDateInput, '2026-07-01');

    const reasonInput = screen.getByTestId('reason-input');
    await user.type(reasonInput, 'Annual review');

    await user.click(screen.getByTestId('salary-update-submit'));

    await waitFor(() => {
      expect(updateSalary).toHaveBeenCalledWith('emp-1', {
        baseSalary: 130000,
        bonus: 15000,
        effectiveDate: '2026-07-01',
        reason: 'Annual review',
      });
      expect(defaultProps.onSuccess).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it('displays API error message on mutation failure', async () => {
    const user = userEvent.setup();
    vi.mocked(updateSalary).mockRejectedValueOnce(new Error('Server Error'));

    renderDialog();

    const effectiveDateInput = screen.getByTestId('effective-date-input');
    await user.type(effectiveDateInput, '2026-07-01');

    const reasonInput = screen.getByTestId('reason-input');
    await user.type(reasonInput, 'Adjustment');

    await user.click(screen.getByTestId('salary-update-submit'));

    await waitFor(() => {
      expect(screen.getByTestId('salary-update-error')).toBeInTheDocument();
      expect(screen.getByText('Server Error')).toBeInTheDocument();
    });

    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('resets form and closes on cancel', async () => {
    const user = userEvent.setup();
    renderDialog();

    const reasonInput = screen.getByTestId('reason-input');
    await user.type(reasonInput, 'Temporary text');

    await user.click(screen.getByTestId('salary-update-cancel'));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    // Never resolve to keep mutation pending
    vi.mocked(updateSalary).mockReturnValueOnce(new Promise(() => {}));

    renderDialog();

    const effectiveDateInput = screen.getByTestId('effective-date-input');
    await user.type(effectiveDateInput, '2026-07-01');

    const reasonInput = screen.getByTestId('reason-input');
    await user.type(reasonInput, 'Review');

    await user.click(screen.getByTestId('salary-update-submit'));

    await waitFor(() => {
      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(screen.getByTestId('salary-update-submit')).toBeDisabled();
    });
  });

  it('validates reason with only whitespace as empty', async () => {
    const user = userEvent.setup();
    renderDialog();

    const effectiveDateInput = screen.getByTestId('effective-date-input');
    await user.type(effectiveDateInput, '2026-07-01');

    const reasonInput = screen.getByTestId('reason-input');
    await user.type(reasonInput, '   ');

    await user.click(screen.getByTestId('salary-update-submit'));

    await waitFor(() => {
      expect(screen.getByText('Reason is required')).toBeInTheDocument();
    });

    expect(updateSalary).not.toHaveBeenCalled();
  });
});
