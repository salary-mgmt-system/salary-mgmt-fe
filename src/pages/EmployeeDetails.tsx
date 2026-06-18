import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

const EmployeeDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
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

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 1, color: 'text.primary', fontWeight: 800 }}>
          Employee Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Detailed view and history for Employee ID: {id}
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Compensation & Profile Info
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Personal details, current salary breakdown, and past salary changes timeline will be displayed here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeDetails;
