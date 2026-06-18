import type { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';

const Dashboard: FC = () => {
  // Mock data for initial layout visualization
  const stats = [
    {
      title: 'Total Employees',
      value: '10,000',
      subtitle: 'Active members',
      icon: <PeopleAltRoundedIcon sx={{ fontSize: '2.5rem', color: 'primary.main' }} />,
    },
    {
      title: 'Average Salary',
      value: '$85,400',
      subtitle: 'Per annum base',
      icon: <AttachMoneyRoundedIcon sx={{ fontSize: '2.5rem', color: 'success.main' }} />,
    },
    {
      title: 'Highest Salary',
      value: '$240,000',
      subtitle: 'Executive level',
      icon: <TrendingUpRoundedIcon sx={{ fontSize: '2.5rem', color: 'secondary.main' }} />,
    },
    {
      title: 'Lowest Salary',
      value: '$32,000',
      subtitle: 'Entry level base',
      icon: <TrendingDownRoundedIcon sx={{ fontSize: '2.5rem', color: 'error.main' }} />,
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 1, color: 'text.primary', fontWeight: 800 }}>
          Welcome back, HR Manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here is an overview of the organization compensation analytics.
        </Typography>
      </Box>

      {/* KPI Cards Grid */}
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid key={stat.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stat.subtitle}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '12px',
                    bgcolor: 'action.hover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
