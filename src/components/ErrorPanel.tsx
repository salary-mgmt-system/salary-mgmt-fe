import type { FC } from 'react';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

import {
  ErrorContainer,
  IconWrapper,
  ErrorTitle,
  ErrorMessage,
  RetryButton,
} from './ErrorPanel.styles';

interface ErrorPanelProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

const ErrorPanel: FC<ErrorPanelProps> = ({
  title = 'Something went wrong',
  message = 'Failed to load data. Please ensure the backend server is running and try again.',
  onRetry,
  retryText = 'Try Again',
}) => {
  return (
    <ErrorContainer data-testid="error-panel">
      <IconWrapper>
        <ErrorOutlineRoundedIcon />
      </IconWrapper>
      <ErrorTitle variant="h5">
        {title}
      </ErrorTitle>
      <ErrorMessage variant="body2">
        {message}
      </ErrorMessage>
      {onRetry && (
        <RetryButton
          variant="contained"
          startIcon={<RefreshRoundedIcon />}
          onClick={onRetry}
          data-testid="error-retry-button"
        >
          {retryText}
        </RetryButton>
      )}
    </ErrorContainer>
  );
};

export default ErrorPanel;
