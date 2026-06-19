import { render, screen } from '@testing-library/react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme';
import Insights from './Insights';
import { describe, it, expect } from 'vitest';

const renderInsights = () => {
  return render(
    <ThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <Insights />
      </StyledThemeProvider>
    </ThemeProvider>
  );
};

describe('Insights Component', () => {
  it('renders insights header, title, and query assistant card', () => {
    renderInsights();
    expect(screen.getByText('Compensation Insights')).toBeInTheDocument();
    expect(screen.getByText('Ask predefined compensation questions to explore organization statistics.')).toBeInTheDocument();
    expect(screen.getByText('Query Assistant')).toBeInTheDocument();
    expect(screen.getByText('Select a predefined question or formulate a query to see targeted aggregate data insights.')).toBeInTheDocument();
  });
});
