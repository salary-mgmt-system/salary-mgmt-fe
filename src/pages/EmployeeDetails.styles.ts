import styled from 'styled-components';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import theme from '../theme/theme';

export const BackButtonContainer = styled(Box)`
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const StyledBackButton = styled(Button)<{ component?: React.ElementType; to?: string }>`
  && {
    border-color: ${theme.palette.divider};
    color: ${theme.palette.text.secondary};
    border-radius: 8px;
  }
`;

export const DetailsCard = styled(Card)`
  && {
    height: 100%;
    border-radius: 12px;
    border: 1px solid ${theme.palette.divider};
    box-shadow: none;
  }
`;

export const DetailsCardContent = styled(CardContent)`
  && {
    padding: 32px;
  }
`;

export const CompensationCardContent = styled(CardContent)`
  && {
    padding: 32px;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

export const ProfileHeader = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

export const AvatarBox = styled(Box)`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: ${theme.palette.primary.light};
  color: ${theme.palette.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledAvatarIcon = styled(AccountCircleRoundedIcon)`
  && {
    font-size: 2rem;
  }
`;

export const ProfileName = styled(Typography)`
  && {
    font-weight: 800;
  }
`;

export const ProfileCode = styled(Typography)`
  && {
    font-weight: 500;
  }
`;

export const FieldLabel = styled(Typography)`
  && {
    font-weight: 600;
    display: block;
    margin-bottom: 4px;
  }
`;

export const FieldValue = styled(Typography)`
  && {
    font-weight: 500;
  }
`;

export const SectionHeader = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
  margin-bottom: 16px;
`;

export const SectionTitle = styled(Typography)`
  && {
    font-weight: 700;
  }
`;

export const CompensationHeader = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

export const CompensationTitle = styled(Typography)`
  && {
    font-weight: 700;
  }
`;

export const CompensationRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

export const BaseSalaryValue = styled(Typography)`
  && {
    font-weight: 700;
  }
`;

export const BonusValue = styled(Typography)`
  && {
    font-weight: 600;
    color: ${theme.palette.success.main};
  }
`;

export const TotalCompensationBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 16px;
  background-color: ${theme.palette.action.hover};
  border-radius: 8px;
`;

export const TotalCompensationValue = styled(Typography)`
  && {
    font-weight: 800;
  }
`;

export const EffectiveDateBox = styled(Box)`
  margin-top: auto;
  padding-top: 16px;
`;

export const StyledDivider = styled(Divider)`
  && {
    margin-top: 24px;
    margin-bottom: 24px;
  }
`;

export const StyledSmallDivider = styled(Divider)`
  && {
    margin-top: 8px;
    margin-bottom: 8px;
  }
`;

export const LoadingCard = styled(Card)`
  && {
    padding: 24px;
    margin-bottom: 24px;
  }
`;

export const LoadingSideCard = styled(Card)`
  && {
    padding: 24px;
  }
`;
