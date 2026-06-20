import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import {
  fetchOverviewAnalytics,
  fetchCountryAnalytics,
  fetchDepartmentAnalytics,
  fetchSalaryDistribution,
} from '../api/api';
import {
  DashboardHeader,
  Title,
  StatCard,
  StatCardContent,
  StatLabel,
  StatValue,
  IconContainer,
  StyledPeopleIcon,
  StyledMoneyIcon,
  StyledMedianIcon,
  StyledTrendingUpIcon,
  StyledTrendingDownIcon,
  ChartSection,
  ChartCard,
  ChartTitle,
  formatCurrency,
  tickFormatter,
  tooltipSalaryFormatter,
  tooltipCountFormatter,
} from './Dashboard.styles';

const Dashboard: FC = () => {
  const theme = useTheme();

  const {
    data: overviewData,
    isLoading: isLoadingOverview,
    error: overviewError,
  } = useQuery({
    queryKey: ['overviewAnalytics'],
    queryFn: fetchOverviewAnalytics,
  });

  const {
    data: countryData,
    isLoading: isLoadingCountry,
    error: countryError,
  } = useQuery({
    queryKey: ['countryAnalytics'],
    queryFn: fetchCountryAnalytics,
  });

  const {
    data: deptData,
    isLoading: isLoadingDept,
    error: deptError,
  } = useQuery({
    queryKey: ['departmentAnalytics'],
    queryFn: fetchDepartmentAnalytics,
  });

  const {
    data: distData,
    isLoading: isLoadingDist,
    error: distError,
  } = useQuery({
    queryKey: ['salaryDistribution'],
    queryFn: fetchSalaryDistribution,
  });

  const hasError = overviewError || countryError || deptError || distError;

  if (hasError) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">
          Failed to load compensation analytics. Please verify that the backend is running.
        </Alert>
      </Box>
    );
  }

  const stats = [
    {
      title: 'Total Employees',
      value: overviewData ? new Intl.NumberFormat().format(overviewData.employeeCount) : '0',
      subtitle: 'Active members',
      icon: <StyledPeopleIcon />,
    },
    {
      title: 'Average Salary',
      value: overviewData ? formatCurrency(overviewData.averageSalary) : '$0',
      subtitle: 'Per annum base',
      icon: <StyledMoneyIcon />,
    },
    {
      title: 'Median Salary',
      value: overviewData ? formatCurrency(overviewData.medianSalary) : '$0',
      subtitle: 'Organization midpoint',
      icon: <StyledMedianIcon />,
    },
    {
      title: 'Highest Salary',
      value: overviewData ? formatCurrency(overviewData.highestSalary) : '$0',
      subtitle: 'Executive level',
      icon: <StyledTrendingUpIcon />,
    },
    {
      title: 'Lowest Salary',
      value: overviewData ? formatCurrency(overviewData.lowestSalary) : '$0',
      subtitle: 'Entry level base',
      icon: <StyledTrendingDownIcon />,
    },
  ];

  return (
    <Box sx={{ pb: 4 }}>
      <DashboardHeader>
        <Title variant="h3">
          Welcome back, HR Manager
        </Title>
        <Typography variant="body1" color="text.secondary">
          Here is an overview of the organization compensation analytics.
        </Typography>
      </DashboardHeader>

      {/* KPI Cards Grid */}
      <Grid container spacing={3}>
        {isLoadingOverview
          ? Array.from({ length: 5 }).map((_, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                <StatCard>
                  <StatCardContent>
                    <Box sx={{ width: '100%' }}>
                      <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="80%" height={48} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="40%" height={16} />
                    </Box>
                  </StatCardContent>
                </StatCard>
              </Grid>
            ))
          : stats.map((stat) => (
              <Grid key={stat.title} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                <StatCard>
                  <StatCardContent>
                    <Box>
                      <StatLabel variant="subtitle2" color="text.secondary">
                        {stat.title}
                      </StatLabel>
                      <StatValue variant="h3">
                        {stat.value}
                      </StatValue>
                      <Typography variant="caption" color="text.secondary">
                        {stat.subtitle}
                      </Typography>
                    </Box>
                    <IconContainer>
                      {stat.icon}
                    </IconContainer>
                  </StatCardContent>
                </StatCard>
              </Grid>
            ))}
      </Grid>

      {/* Analytics Visualizations */}
      <ChartSection>
        <Grid container spacing={3}>
          {/* Salary by Country Chart */}
          <Grid size={{ xs: 12, md: 6 }}>
            <ChartCard>
              <ChartTitle variant="h6">Compensation by Country</ChartTitle>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Comparison of Average and Median annual base salaries across countries
              </Typography>
              <Box sx={{ width: '100%', height: 350 }}>
                {isLoadingCountry ? (
                  <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 2 }} />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countryData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} />
                      <YAxis stroke="#6B7280" fontSize={11} tickLine={false} tickFormatter={tickFormatter} />
                      <Tooltip formatter={tooltipSalaryFormatter} contentStyle={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none' }} />
                      <Legend iconType="circle" />
                      <Bar dataKey="averageSalary" name="Average Salary" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="medianSalary" name="Median Salary" fill={theme.palette.info.main} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </ChartCard>
          </Grid>

          {/* Salary by Department Chart */}
          <Grid size={{ xs: 12, md: 6 }}>
            <ChartCard>
              <ChartTitle variant="h6">Compensation by Department</ChartTitle>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Comparison of Average and Median annual base salaries across departments
              </Typography>
              <Box sx={{ width: '100%', height: 350 }}>
                {isLoadingDept ? (
                  <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 2 }} />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} />
                      <YAxis stroke="#6B7280" fontSize={11} tickLine={false} tickFormatter={tickFormatter} />
                      <Tooltip formatter={tooltipSalaryFormatter} contentStyle={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none' }} />
                      <Legend iconType="circle" />
                      <Bar dataKey="averageSalary" name="Average Salary" fill={theme.palette.success.main} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="medianSalary" name="Median Salary" fill={theme.palette.info.main} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </ChartCard>
          </Grid>

          {/* Salary Distribution Chart */}
          <Grid size={{ xs: 12 }}>
            <ChartCard>
              <ChartTitle variant="h6">Organization Salary Distribution</ChartTitle>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Employee distribution across USD-normalized annual salary brackets
              </Typography>
              <Box sx={{ width: '100%', height: 350 }}>
                {isLoadingDist ? (
                  <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 2 }} />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="bracket" stroke="#6B7280" fontSize={11} tickLine={false} />
                      <YAxis stroke="#6B7280" fontSize={11} tickLine={false} />
                      <Tooltip formatter={tooltipCountFormatter} contentStyle={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none' }} />
                      <Bar dataKey="count" name="Employee Count" fill={theme.palette.secondary.main} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </ChartCard>
          </Grid>
        </Grid>
      </ChartSection>
    </Box>
  );
};

export default Dashboard;
