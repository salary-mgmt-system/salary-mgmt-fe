import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';

import { fetchOverviewAnalytics } from '../api/api';
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
} from './Dashboard.styles';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const Dashboard: FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['overviewAnalytics'],
    queryFn: fetchOverviewAnalytics,
  });

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">
          Failed to load compensation overview analytics. Please verify that the backend is running.
        </Alert>
      </Box>
    );
  }

  const stats = [
    {
      title: 'Total Employees',
      value: data ? new Intl.NumberFormat().format(data.employeeCount) : '0',
      subtitle: 'Active members',
      icon: <StyledPeopleIcon />,
    },
    {
      title: 'Average Salary',
      value: data ? formatCurrency(data.averageSalary) : '$0',
      subtitle: 'Per annum base',
      icon: <StyledMoneyIcon />,
    },
    {
      title: 'Median Salary',
      value: data ? formatCurrency(data.medianSalary) : '$0',
      subtitle: 'Organization midpoint',
      icon: <StyledMedianIcon />,
    },
    {
      title: 'Highest Salary',
      value: data ? formatCurrency(data.highestSalary) : '$0',
      subtitle: 'Executive level',
      icon: <StyledTrendingUpIcon />,
    },
    {
      title: 'Lowest Salary',
      value: data ? formatCurrency(data.lowestSalary) : '$0',
      subtitle: 'Entry level base',
      icon: <StyledTrendingDownIcon />,
    },
  ];

  return (
    <Box>
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
        {isLoading
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
    </Box>
  );
};

export default Dashboard;
