import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';

import ErrorPanel from '../components/ErrorPanel';
import { queryInsights } from '../api/api';
import {
  PageHeader,
  PageTitle,
  InsightsCardContent,
  CardTitle,
  FormContainer,
  SuggestionsTitle,
  SuggestionsBox,
  SuggestionChip,
  ResultBox,
  AnswerText,
  LoaderContainer,
} from './Insights.styles';

const SAMPLE_QUESTIONS = [
  'What is the average salary in India?',
  'Which department has the highest average salary?',
  'How many employees earn more than $100,000?',
  'Who are the top 10 highest-paid employees?',
];

const Insights: FC = () => {
  const [question, setQuestion] = useState('');

  const mutation = useMutation({
    mutationFn: (q: string) => queryInsights(q),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    mutation.mutate(question);
  };

  const handleSuggestionClick = (q: string) => {
    setQuestion(q);
    mutation.mutate(q);
  };

  return (
    <Box className="animate-page" sx={{ pb: 4 }}>
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
          <CardTitle variant="h5">
            Query Assistant
          </CardTitle>
          <Typography variant="body2" color="text.secondary">
            Select a predefined question or formulate a query to see targeted aggregate data insights.
          </Typography>

          <form onSubmit={handleSubmit}>
            <FormContainer>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask a compensation question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={mutation.isPending || !question.trim()}
                        startIcon={<SearchRoundedIcon />}
                        sx={{ borderRadius: '8px', ml: 1, textTransform: 'none' }}
                      >
                        Ask
                      </Button>
                    ),
                  },
                }}
              />
            </FormContainer>
          </form>

          <SuggestionsTitle variant="subtitle2" color="text.secondary">
            Suggested questions:
          </SuggestionsTitle>
          <SuggestionsBox>
            {SAMPLE_QUESTIONS.map((q) => (
              <SuggestionChip
                key={q}
                onClick={() => handleSuggestionClick(q)}
                startIcon={<LightbulbRoundedIcon fontSize="small" sx={{ opacity: 0.7 }} />}
              >
                {q}
              </SuggestionChip>
            ))}
          </SuggestionsBox>
        </InsightsCardContent>
      </Card>

      {/* Query Status & Results */}
      {mutation.isPending && (
        <LoaderContainer>
          <CircularProgress />
        </LoaderContainer>
      )}

      {mutation.isError && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <ErrorPanel
            title="Insights Query Error"
            message="Failed to fetch compensation insights. Please verify that the question is valid and the backend is running."
            onRetry={() => {
              if (question.trim()) {
                mutation.mutate(question);
              }
            }}
          />
        </Box>
      )}

      {mutation.isSuccess && (
        <ResultBox>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 1.5 }}>
            Answer
          </Typography>
          <AnswerText variant="body1">
            {mutation.data.answer}
          </AnswerText>
        </ResultBox>
      )}
    </Box>
  );
};

export default Insights;
