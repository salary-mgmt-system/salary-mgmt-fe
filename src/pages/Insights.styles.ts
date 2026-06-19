import styled from 'styled-components';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
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
