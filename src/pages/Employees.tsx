import type { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const Employees: FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 1, color: 'text.primary', fontWeight: 800 }}>
          Employee Directory
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage, search, and audit employee records and compensation structures.
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Active Directory
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Employee list tables, searching, and advanced filtering tools will be displayed here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Employees;
