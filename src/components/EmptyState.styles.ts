import styled, { keyframes } from 'styled-components';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import theme from '../theme/theme';

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const EmptyContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  text-align: center;
  background-color: ${theme.palette.background.paper};
  border: 1px dashed ${theme.palette.divider};
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  margin: 24px auto;
  animation: ${fadeIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

export const IconWrapper = styled(Box)`
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background-color: ${theme.palette.action.hover};
  color: ${theme.palette.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  animation: ${float} 4s ease-in-out infinite;

  & svg {
    font-size: 2.5rem;
    opacity: 0.8;
  }
`;

export const EmptyTitle = styled(Typography)`
  && {
    font-weight: 700;
    color: ${theme.palette.text.primary};
    margin-bottom: 8px;
  }
`;

export const EmptyMessage = styled(Typography)`
  && {
    color: ${theme.palette.text.secondary};
    font-size: 0.925rem;
    margin-bottom: 24px;
    max-width: 380px;
    line-height: 1.5;
  }
`;

export const ActionButton = styled(Button)`
  && {
    font-weight: 600;
    text-transform: none;
    border-radius: 8px;
    padding: 8px 20px;
  }
`;
