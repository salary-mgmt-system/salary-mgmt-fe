import { useState, type FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import { fetchEmployeeDetails, fetchSalaryHistory } from '../api/api';
import SalaryUpdateDialog from '../components/SalaryUpdateDialog';
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
  UpdateSalaryButton,
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
  TimelineHeader,
  TimelineTitle,
  TimelineContainer,
  TimelineItem,
  TimelineDot,
  TimelineContentCard,
  TimelineChangeInfo,
  TimelineDifference,
  TimelineReason,
  TimelineDate,
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
  const employeeId = id || '';

  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => fetchEmployeeDetails(employeeId),
    enabled: !!employeeId,
  });

  const { data: salaryHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['employeeSalaryHistory', employeeId],
    queryFn: () => fetchSalaryHistory(employeeId),
    enabled: !!employeeId,
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
                  {currentSalary && (
                    <UpdateSalaryButton
                      variant="outlined"
                      size="small"
                      startIcon={<EditRoundedIcon />}
                      onClick={() => setDialogOpen(true)}
                      data-testid="update-salary-btn"
                    >
                      Update
                    </UpdateSalaryButton>
                  )}
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

          {/* Salary History Card */}
          <Grid size={{ xs: 12 }}>
            <DetailsCard>
              <DetailsCardContent>
                <TimelineHeader>
                  <HistoryRoundedIcon color="secondary" />
                  <TimelineTitle variant="h6">Compensation History</TimelineTitle>
                </TimelineHeader>
                <StyledDivider />

                {isLoadingHistory ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} data-testid="timeline-loading">
                    <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
                    <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
                  </Box>
                ) : salaryHistory && salaryHistory.length > 0 ? (
                  <TimelineContainer data-testid="timeline-container">
                    {salaryHistory.map((item, index) => {
                      const diff = item.newSalary - item.oldSalary;
                      const isPositive = diff >= 0;
                      const percentChange = item.oldSalary > 0 
                        ? ((diff / item.oldSalary) * 100).toFixed(1)
                        : null;

                      let formattedDate = item.changedAt;
                      const dateObj = new Date(item.changedAt);
                      if (!isNaN(dateObj.getTime())) {
                        try {
                          formattedDate = dateObj.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'UTC',
                          });
                        } catch {
                          // ignore error
                        }
                      }

                      return (
                        <TimelineItem key={item.id} data-testid="timeline-item">
                          <TimelineDot $isLatest={index === 0} />
                          <TimelineContentCard>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                              <TimelineChangeInfo>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                  {formatCurrency(item.oldSalary, employee.currency)}
                                </Typography>
                                <ArrowForwardRoundedIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                  {formatCurrency(item.newSalary, employee.currency)}
                                </Typography>
                                <TimelineDifference $isPositive={isPositive}>
                                  {isPositive ? '+' : ''}
                                  {formatCurrency(diff, employee.currency)}
                                  {percentChange ? ` (${isPositive ? '+' : ''}${percentChange}%)` : ''}
                                </TimelineDifference>
                              </TimelineChangeInfo>
                              <TimelineDate color="text.secondary">
                                {formattedDate}
                              </TimelineDate>
                            </Box>
                            <TimelineReason variant="body2" color="text.secondary">
                              <strong>Reason:</strong> {item.reason}
                            </TimelineReason>
                          </TimelineContentCard>
                        </TimelineItem>
                      );
                    })}
                  </TimelineContainer>
                ) : (
                  <Typography color="text.secondary" sx={{ py: 2 }} data-testid="no-timeline-data">
                    No previous salary changes recorded for this employee.
                  </Typography>
                )}
              </DetailsCardContent>
            </DetailsCard>
          </Grid>
        </Grid>
      ) : (
        <Alert severity="warning">Employee not found.</Alert>
      )}

      {/* Salary Update Dialog */}
      {employee && currentSalary && (
        <SalaryUpdateDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSuccess={() => setSnackbarOpen(true)}
          employeeId={employeeId}
          employeeName={`${employee.firstName} ${employee.lastName}`}
          currency={employee.currency}
          currentBaseSalary={currentSalary.baseSalary}
          currentBonus={currentSalary.bonus}
        />
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
          data-testid="salary-update-success"
        >
          Salary updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeDetails;
