import type { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

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
  StyledTrendingUpIcon,
  StyledTrendingDownIcon,
} from './Dashboard.styles';

const Dashboard: FC = () => {
  const stats = [
    {
      title: 'Total Employees',
      value: '10,000',
      subtitle: 'Active members',
      icon: <StyledPeopleIcon />,
    },
    {
      title: 'Average Salary',
      value: '$85,400',
      subtitle: 'Per annum base',
      icon: <StyledMoneyIcon />,
    },
    {
      title: 'Highest Salary',
      value: '$240,000',
      subtitle: 'Executive level',
      icon: <StyledTrendingUpIcon />,
    },
    {
      title: 'Lowest Salary',
      value: '$32,000',
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
        {stats.map((stat) => (
          <Grid key={stat.title} size={{ xs: 12, sm: 6, md: 3 }}>
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
