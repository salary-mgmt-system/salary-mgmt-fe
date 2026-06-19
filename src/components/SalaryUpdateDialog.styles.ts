import styled from 'styled-components';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import theme from '../theme/theme';

export const StyledDialogTitle = styled(DialogTitle)`
  && {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 24px 32px 16px;
    font-weight: 700;
    font-size: 1.25rem;
  }
`;

export const StyledDialogContent = styled(DialogContent)`
  && {
    padding: 16px 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;

export const StyledDialogActions = styled(DialogActions)`
  && {
    padding: 16px 32px 24px;
    gap: 12px;
  }
`;

export const FormRow = styled(Box)`
  display: flex;
  gap: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const CurrentValueHint = styled(Typography)`
  && {
    font-size: 0.75rem;
    font-weight: 500;
    color: ${theme.palette.text.secondary};
    margin-top: 2px;
  }
`;

export const EmployeeNameChip = styled(Box)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  background-color: ${theme.palette.primary.light}20;
  color: ${theme.palette.primary.main};
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 4px;
`;
