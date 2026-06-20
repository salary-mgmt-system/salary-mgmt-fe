import type { FC, ReactNode } from 'react';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';

import {
  EmptyContainer,
  IconWrapper,
  EmptyTitle,
  EmptyMessage,
  ActionButton,
} from './EmptyState.styles';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: FC<EmptyStateProps> = ({
  icon = <InboxRoundedIcon />,
  title = 'No data available',
  message = 'There are no records to display at this moment.',
  actionText,
  onAction,
}) => {
  return (
    <EmptyContainer data-testid="empty-state">
      <IconWrapper>
        {icon}
      </IconWrapper>
      <EmptyTitle variant="h5">
        {title}
      </EmptyTitle>
      <EmptyMessage variant="body2">
        {message}
      </EmptyMessage>
      {actionText && onAction && (
        <ActionButton
          variant="contained"
          onClick={onAction}
          data-testid="empty-state-action"
        >
          {actionText}
        </ActionButton>
      )}
    </EmptyContainer>
  );
};

export default EmptyState;
