import type { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

import {
  PageHeader,
  PageTitle,
  InsightsCardContent,
  CardTitle,
} from './Insights.styles';

const Insights: FC = () => {
  return (
    <Box>
      <PageHeader>
        <PageTitle variant="h3">
          Compensation Insights
        </PageTitle>
        <Typography variant="body1" color="text.secondary">
          Ask predefined compensation questions to explore organization statistics.
        </Typography>
      </PageHeader>

      <Card>
        <InsightsCardContent>
          <CardTitle variant="h4">
            Query Assistant
          </CardTitle>
          <Typography variant="body1" color="text.secondary">
            Select a predefined question or formulate a query to see targeted aggregate data insights.
          </Typography>
        </InsightsCardContent>
      </Card>
    </Box>
  );
};

export default Insights;
