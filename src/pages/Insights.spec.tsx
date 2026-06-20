import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme';
import Insights from './Insights';
import { queryInsights } from '../api/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../api/api', () => ({
  queryInsights: vi.fn(),
}));

const renderInsights = () => {
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
          <Insights />
        </StyledThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('Insights Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders insights header, title, and query assistant card', () => {
    renderInsights();
    expect(screen.getByText('Compensation Insights')).toBeInTheDocument();
    expect(screen.getByText('Ask predefined compensation questions to explore organization statistics.')).toBeInTheDocument();
    expect(screen.getByText('Query Assistant')).toBeInTheDocument();
    expect(screen.getByText('Suggested questions:')).toBeInTheDocument();
  });

  it('allows user to type a custom question and submits query', async () => {
    vi.mocked(queryInsights).mockResolvedValueOnce({
      answer: 'The average salary in India is $90,000.',
    });

    renderInsights();

    const input = screen.getByPlaceholderText('Ask a compensation question...');
    fireEvent.change(input, { target: { value: 'What is the average salary in India?' } });

    const askButton = screen.getByRole('button', { name: /ask/i });
    fireEvent.click(askButton);

    await waitFor(() => {
      expect(queryInsights).toHaveBeenCalledWith('What is the average salary in India?');
      expect(screen.getByText('Answer')).toBeInTheDocument();
      expect(screen.getByText('The average salary in India is $90,000.')).toBeInTheDocument();
    });
  });

  it('submits query when a suggestion chip is clicked', async () => {
    vi.mocked(queryInsights).mockResolvedValueOnce({
      answer: 'Engineering has the highest average salary of $120,000.',
    });

    renderInsights();

    const suggestion = screen.getByText('Which department has the highest average salary?');
    fireEvent.click(suggestion);

    await waitFor(() => {
      expect(queryInsights).toHaveBeenCalledWith('Which department has the highest average salary?');
      expect(screen.getByText('Answer')).toBeInTheDocument();
      expect(screen.getByText('Engineering has the highest average salary of $120,000.')).toBeInTheDocument();
    });
  });

  it('displays error message when query assistant fails', async () => {
    vi.mocked(queryInsights).mockRejectedValueOnce(new Error('Network failure'));

    renderInsights();

    const suggestion = screen.getByText('Who are the top 10 highest-paid employees?');
    fireEvent.click(suggestion);

    await waitFor(() => {
      expect(
        screen.getByText(
          'Failed to fetch compensation insights. Please verify that the question is valid and the backend is running.'
        )
      ).toBeInTheDocument();
    });
  });

  it('calls queryInsights again when retry button is clicked', async () => {
    vi.mocked(queryInsights).mockRejectedValueOnce(new Error('Network failure'));
    renderInsights();

    // Trigger query
    const suggestion = screen.getByText('Who are the top 10 highest-paid employees?');
    fireEvent.click(suggestion);

    // Wait for the retry button
    let retryBtn: HTMLElement;
    await waitFor(() => {
      retryBtn = screen.getByTestId('error-retry-button');
      expect(retryBtn).toBeInTheDocument();
    });

    vi.mocked(queryInsights).mockClear();
    vi.mocked(queryInsights).mockResolvedValueOnce({ answer: 'Mocked retry answer' });
    
    // Click retry
    fireEvent.click(retryBtn!);

    await waitFor(() => {
      expect(screen.getByText('Mocked retry answer')).toBeInTheDocument();
    });
  });

  it('does not submit query if input is empty', () => {
    renderInsights();
    const input = screen.getByPlaceholderText('Ask a compensation question...');
    const form = input.closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    expect(queryInsights).not.toHaveBeenCalled();
  });
});
