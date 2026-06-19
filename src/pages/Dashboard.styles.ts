import styled from 'styled-components';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import theme from '../theme/theme';

export const DashboardHeader = styled(Box)`
  margin-bottom: 32px;
`;

export const Title = styled(Typography)`
  && {
    margin-bottom: 8px;
    color: ${theme.palette.text.primary};
    font-weight: 800;
  }
`;

export const StatCard = styled(Card)`
  && {
    height: 100%;
  }
`;

export const StatCardContent = styled(CardContent)`
  && {
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const StatLabel = styled(Typography)`
  && {
    font-weight: 600;
    margin-bottom: 8px;
  }
`;

export const StatValue = styled(Typography)`
  && {
    font-weight: 800;
    color: ${theme.palette.text.primary};
    margin-bottom: 4px;
  }
`;

export const IconContainer = styled(Box)`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: ${theme.palette.action.hover};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledPeopleIcon = styled(PeopleAltRoundedIcon)`
  && {
    font-size: 2.5rem;
    color: ${theme.palette.primary.main};
  }
`;

export const StyledMoneyIcon = styled(AttachMoneyRoundedIcon)`
  && {
    font-size: 2.5rem;
    color: ${theme.palette.success.main};
  }
`;

export const StyledTrendingUpIcon = styled(TrendingUpRoundedIcon)`
  && {
    font-size: 2.5rem;
    color: ${theme.palette.secondary.main};
  }
`;

export const StyledTrendingDownIcon = styled(TrendingDownRoundedIcon)`
  && {
    font-size: 2.5rem;
    color: ${theme.palette.error.main};
  }
`;
