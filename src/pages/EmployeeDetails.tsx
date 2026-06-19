import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';

import { fetchEmployeeDetails } from '../api/api';

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
        <Box sx={{ mb: 4 }}>
          <Button
            component={Link}
            to="/employees"
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ borderColor: 'divider', color: 'text.secondary' }}
          >
            Back to Directory
          </Button>
        </Box>
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
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          component={Link}
          to="/employees"
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ borderColor: 'divider', color: 'text.secondary', borderRadius: 2 }}
        >
          Back to Directory
        </Button>
      </Box>

      {isLoading ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: 3, mb: 3 }}>
              <Skeleton variant="text" height={40} width="60%" />
              <Skeleton variant="text" height={20} width="40%" />
              <Divider sx={{ my: 2 }} />
              <Skeleton variant="rectangular" height={150} />
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 3 }}>
              <Skeleton variant="rectangular" height={200} />
            </Card>
          </Grid>
        </Grid>
      ) : employee ? (
        <Grid container spacing={3}>
          {/* Main Info Card */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AccountCircleRoundedIcon sx={{ fontSize: '2rem' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {`${employee.firstName} ${employee.lastName}`}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {employee.employeeCode}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Email Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {employee.email}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Country (Currency)
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {`${employee.country} (${employee.currency})`}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 4, mb: 2 }}>
                  <BusinessCenterRoundedIcon color="action" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Organization Details
                  </Typography>
                </Box>
                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Department
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {employee.department}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Designation
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {employee.designation}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Compensation Summary Card */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <PaymentsRoundedIcon color="primary" />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Current Compensation
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {currentSalary ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Base Salary
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {formatCurrency(currentSalary.baseSalary, employee.currency)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Bonus
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                        + {formatCurrency(currentSalary.bonus, employee.currency)}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        p: 2,
                        bgcolor: 'action.hover',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Total Compensation
                      </Typography>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
                        {formatCurrency(currentSalary.baseSalary + currentSalary.bonus, employee.currency)}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 'auto', pt: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                        Effective Date of Salary
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {currentSalary.effectiveDate}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography color="text.secondary">No active salary record exists for this employee.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Alert severity="warning">Employee not found.</Alert>
      )}
    </Box>
  );
};

export default EmployeeDetails;
