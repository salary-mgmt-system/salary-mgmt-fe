import styled, { keyframes } from 'styled-components';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ErrorContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  text-align: center;
  background: linear-gradient(135deg, #fef2f2 0%, #fff5f5 100%);
  border: 1px solid #fca5a5;
  border-radius: 16px;
  max-width: 500px;
  margin: 32px auto;
  box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.05), 0 8px 10px -6px rgba(239, 68, 68, 0.05);
  animation: ${fadeIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

export const IconWrapper = styled(Box)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #fee2e2;
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  animation: ${pulse} 2s infinite ease-in-out;

  & svg {
    font-size: 2.25rem;
  }
`;

export const ErrorTitle = styled(Typography)`
  && {
    font-weight: 700;
    color: #991b1b;
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }
`;

export const ErrorMessage = styled(Typography)`
  && {
    color: #b91c1c;
    font-size: 0.925rem;
    margin-bottom: 24px;
    max-width: 400px;
    line-height: 1.5;
  }
`;

export const RetryButton = styled(Button)`
  && {
    background-color: #ef4444;
    color: #ffffff;
    padding: 8px 24px;
    font-weight: 600;
    text-transform: none;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
    transition: all 0.2s ease;

    &:hover {
      background-color: #dc2626;
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }
`;
