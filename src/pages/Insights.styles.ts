import styled from 'styled-components';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import theme from '../theme/theme';

export const PageHeader = styled(Box)`
  margin-bottom: 32px;
`;

export const PageTitle = styled(Typography)`
  && {
    margin-bottom: 8px;
    color: ${theme.palette.text.primary};
    font-weight: 800;
  }
`;

export const InsightsCardContent = styled(CardContent)`
  && {
    padding: 32px;
  }
`;

export const CardTitle = styled(Typography)`
  && {
    margin-bottom: 16px;
    font-weight: 700;
  }
`;

export const FormContainer = styled(Box)`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SuggestionsTitle = styled(Typography)`
  && {
    font-weight: 600;
    margin-bottom: 12px;
    margin-top: 16px;
  }
`;

export const SuggestionsBox = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
`;

export const SuggestionChip = styled(Button)`
  && {
    border-radius: 20px;
    text-transform: none;
    font-weight: 500;
    padding: 6px 16px;
    background-color: ${theme.palette.action.hover};
    color: ${theme.palette.text.secondary};
    border: 1px solid ${theme.palette.divider};
    text-align: left;
    justify-content: flex-start;
    &:hover {
      background-color: ${theme.palette.action.selected};
      border-color: ${theme.palette.text.secondary};
    }
  }
`;

export const ResultBox = styled(Box)`
  margin-top: 32px;
  padding: 24px;
  border-radius: 12px;
  background-color: ${theme.palette.background.paper};
  border: 1px solid ${theme.palette.divider};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

export const AnswerText = styled(Typography)`
  && {
    white-space: pre-wrap;
    line-height: 1.7;
    color: ${theme.palette.text.primary};
  }
`;

export const LoaderContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;
