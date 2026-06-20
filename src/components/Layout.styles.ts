import styled from 'styled-components';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import theme from '../theme/theme';

import IconButton from '@mui/material/IconButton';

export const DRAWER_WIDTH = 260;

export const RootContainer = styled(Box)`
  display: flex;
  min-height: 100vh;
  background-color: ${theme.palette.background.default};
`;

export const StyledAppBar = styled(AppBar)`
  && {
    width: 100%;
    box-shadow: none;
    border-bottom: 1px solid ${theme.palette.divider};
    background-color: ${theme.palette.background.paper};
    color: ${theme.palette.text.primary};

    @media (min-width: 600px) {
      width: calc(100% - ${DRAWER_WIDTH}px);
      margin-left: ${DRAWER_WIDTH}px;
    }
  }
`;

export const StyledToolbar = styled(Toolbar)`
  && {
    justify-content: flex-start;
    padding-left: 16px;
    padding-right: 16px;

    @media (min-width: 600px) {
      padding-left: 24px;
      padding-right: 24px;
    }
  }
`;

export const Title = styled(Typography)`
  && {
    font-weight: 700;
    color: ${theme.palette.primary.main};
  }
`;

export const MenuButton = styled(IconButton)`
  && {
    margin-right: 12px;
    color: ${theme.palette.text.secondary};

    @media (min-width: 600px) {
      display: none;
    }
  }
`;

export const StyledDrawer = styled(Drawer)<{ $isMobile?: boolean }>`
  width: ${DRAWER_WIDTH}px;
  flex-shrink: 0;

  @media (max-width: 599px) {
    display: ${props => (props.$isMobile ? 'block' : 'none')};
  }

  @media (min-width: 600px) {
    display: ${props => (props.$isMobile ? 'none' : 'block')};
  }

  & .MuiDrawer-paper {
    width: ${DRAWER_WIDTH}px;
    box-sizing: border-box;
    border-right: 1px solid ${theme.palette.divider};
    background-color: ${theme.palette.background.paper};
  }
`;

export const LogoContainer = styled(Box)`
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const LogoIcon = styled(Box)`
  width: 32px;
  height: 32px;
  border-radius: 12px;
  background-color: ${theme.palette.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.palette.primary.contrastText};
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
`;

export const LogoText = styled(Typography)`
  && {
    font-weight: 800;
    color: ${theme.palette.text.primary};
    letter-spacing: -0.02em;
  }
`;

export const NavList = styled(List)`
  && {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

export const NavItemButton = styled(ListItemButton)<{ component?: React.ElementType; to?: string }>`
  && {
    border-radius: 16px;
    padding-top: 9.6px;
    padding-bottom: 9.6px;
    padding-left: 16px;
    padding-right: 16px;
    transition: all 0.2s ease-in-out;

    &.Mui-selected {
      background-color: ${theme.palette.primary.main};
      color: ${theme.palette.primary.contrastText};
      &:hover {
        background-color: ${theme.palette.primary.dark};
      }
      & .MuiListItemIcon-root {
        color: ${theme.palette.primary.contrastText};
      }
      & .MuiTypography-root {
        color: ${theme.palette.primary.contrastText};
      }
    }

    &:hover {
      background-color: ${theme.palette.action.hover};
    }
  }
`;

export const NavItemIcon = styled(ListItemIcon)<{ $isSelected?: boolean }>`
  && {
    min-width: 40px;
    color: ${props => (props.$isSelected ? theme.palette.primary.contrastText : theme.palette.text.secondary)};
    transition: color 0.2s ease-in-out;
  }
`;

export const NavItemText = styled(Typography)<{ $isSelected?: boolean }>`
  && {
    font-weight: ${props => (props.$isSelected ? 600 : 500)};
    font-size: 0.925rem;
    color: ${props => (props.$isSelected ? theme.palette.primary.contrastText : theme.palette.text.primary)};
  }
`;

export const MainContent = styled(Box)`
  flex-grow: 1;
  padding: 16px;
  margin-top: 56px;
  width: 100%;

  @media (min-width: 600px) {
    padding: 32px;
    margin-top: 64px;
    width: calc(100% - ${DRAWER_WIDTH}px);
  }
`;
