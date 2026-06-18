import type { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const Insights: FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 1, color: 'text.primary', fontWeight: 800 }}>
          Compensation Insights
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ask predefined compensation questions to explore organization statistics.
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Query Assistant
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select a predefined question or formulate a query to see targeted aggregate data insights.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Insights;
