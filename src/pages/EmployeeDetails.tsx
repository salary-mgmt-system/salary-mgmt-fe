import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';

import { fetchEmployeeDetails } from '../api/api';
import {
  BackButtonContainer,
  StyledBackButton,
  DetailsCard,
  DetailsCardContent,
  CompensationCardContent,
  ProfileHeader,
  AvatarBox,
  StyledAvatarIcon,
  ProfileName,
  ProfileCode,
  FieldLabel,
  FieldValue,
  SectionHeader,
  SectionTitle,
  CompensationHeader,
  CompensationTitle,
  CompensationRow,
  BaseSalaryValue,
  BonusValue,
  TotalCompensationBox,
  TotalCompensationValue,
  EffectiveDateBox,
  StyledDivider,
  StyledSmallDivider,
  LoadingCard,
  LoadingSideCard,
} from './EmployeeDetails.styles';

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

const EmployeeDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployeeDetails(id || ''),
    enabled: !!id,
  });

  if (isError) {
    return (
      <Box>
        <BackButtonContainer>
          <StyledBackButton
            component={Link}
            to="/employees"
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
          >
            Back to Directory
          </StyledBackButton>
        </BackButtonContainer>
        <Alert severity="error">
          Error loading employee details: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  const employee = data?.employee;
  const currentSalary = data?.currentSalary;

  return (
    <Box>
      <BackButtonContainer>
        <StyledBackButton
          component={Link}
          to="/employees"
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
        >
          Back to Directory
        </StyledBackButton>
      </BackButtonContainer>

      {isLoading ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <LoadingCard>
              <Skeleton variant="text" height={40} width="60%" />
              <Skeleton variant="text" height={20} width="40%" />
              <StyledDivider />
              <Skeleton variant="rectangular" height={150} />
            </LoadingCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <LoadingSideCard>
              <Skeleton variant="rectangular" height={200} />
            </LoadingSideCard>
          </Grid>
        </Grid>
      ) : employee ? (
        <Grid container spacing={3}>
          {/* Main Info Card */}
          <Grid size={{ xs: 12, md: 7 }}>
            <DetailsCard>
              <DetailsCardContent>
                <ProfileHeader>
                  <AvatarBox>
                    <StyledAvatarIcon />
                  </AvatarBox>
                  <Box>
                    <ProfileName variant="h4">
                      {`${employee.firstName} ${employee.lastName}`}
                    </ProfileName>
                    <ProfileCode variant="subtitle1" color="text.secondary">
                      {employee.employeeCode}
                    </ProfileCode>
                  </Box>
                </ProfileHeader>

                <StyledDivider />

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FieldLabel variant="caption" color="text.secondary">
                      Email Address
                    </FieldLabel>
                    <FieldValue variant="body1">
                      {employee.email}
                    </FieldValue>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FieldLabel variant="caption" color="text.secondary">
                      Country (Currency)
                    </FieldLabel>
                    <FieldValue variant="body1">
                      {`${employee.country} (${employee.currency})`}
                    </FieldValue>
                  </Grid>
                </Grid>

                <SectionHeader>
                  <BusinessCenterRoundedIcon color="action" />
                  <SectionTitle variant="h6">
                    Organization Details
                  </SectionTitle>
                </SectionHeader>
                <StyledDivider />

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FieldLabel variant="caption" color="text.secondary">
                      Department
                    </FieldLabel>
                    <FieldValue variant="body1">
                      {employee.department}
                    </FieldValue>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FieldLabel variant="caption" color="text.secondary">
                      Designation
                    </FieldLabel>
                    <FieldValue variant="body1">
                      {employee.designation}
                    </FieldValue>
                  </Grid>
                </Grid>
              </DetailsCardContent>
            </DetailsCard>
          </Grid>

          {/* Compensation Summary Card */}
          <Grid size={{ xs: 12, md: 5 }}>
            <DetailsCard>
              <CompensationCardContent>
                <CompensationHeader>
                  <PaymentsRoundedIcon color="primary" />
                  <CompensationTitle variant="h5">
                    Current Compensation
                  </CompensationTitle>
                </CompensationHeader>
                <StyledDivider />

                {currentSalary ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flexGrow: 1 }}>
                    <CompensationRow>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Base Salary
                      </Typography>
                      <BaseSalaryValue variant="h5">
                        {formatCurrency(currentSalary.baseSalary, employee.currency)}
                      </BaseSalaryValue>
                    </CompensationRow>

                    <CompensationRow>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Bonus
                      </Typography>
                      <BonusValue variant="h6">
                        + {formatCurrency(currentSalary.bonus, employee.currency)}
                      </BonusValue>
                    </CompensationRow>

                    <StyledSmallDivider />

                    <TotalCompensationBox>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Total Compensation
                      </Typography>
                      <TotalCompensationValue variant="h4" color="primary">
                        {formatCurrency(currentSalary.baseSalary + currentSalary.bonus, employee.currency)}
                      </TotalCompensationValue>
                    </TotalCompensationBox>

                    <EffectiveDateBox>
                      <FieldLabel variant="caption" color="text.secondary">
                        Effective Date of Salary
                      </FieldLabel>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {currentSalary.effectiveDate}
                      </Typography>
                    </EffectiveDateBox>
                  </Box>
                ) : (
                  <Typography color="text.secondary">No active salary record exists for this employee.</Typography>
                )}
              </CompensationCardContent>
            </DetailsCard>
          </Grid>
        </Grid>
      ) : (
        <Alert severity="warning">Employee not found.</Alert>
      )}
    </Box>
  );
};

export default EmployeeDetails;
