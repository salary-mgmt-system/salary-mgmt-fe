import type { FC } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';

import {
  RootContainer,
  StyledAppBar,
  StyledToolbar,
  Title,
  StyledDrawer,
  LogoContainer,
  LogoIcon,
  LogoText,
  NavList,
  NavItemButton,
  NavItemIcon,
  NavItemText,
  MainContent,
} from './Layout.styles';

const Layout: FC = () => {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', path: '/', icon: <DashboardRoundedIcon /> },
    { text: 'Employees', path: '/employees', icon: <PeopleAltRoundedIcon /> },
    { text: 'Insights', path: '/insights', icon: <AnalyticsRoundedIcon /> },
  ];

  return (
    <RootContainer>
      {/* Header (AppBar) */}
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <Title variant="h4">
            {menuItems.find((item) => item.path === location.pathname)?.text || 'Salary Management'}
          </Title>
        </StyledToolbar>
      </StyledAppBar>

      {/* Sidebar Navigation (Drawer) */}
      <StyledDrawer variant="permanent">
        {/* Sidebar Header / Logo */}
        <LogoContainer>
          <LogoIcon>S</LogoIcon>
          <LogoText variant="h5">SalarySync</LogoText>
        </LogoContainer>
        <Divider />

        {/* Navigation Items */}
        <NavList>
          {menuItems.map((item) => {
            const isSelected =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <ListItem key={item.text} disablePadding>
                <NavItemButton
                  component={Link}
                  to={item.path}
                  selected={isSelected}
                >
                  <NavItemIcon $isSelected={isSelected}>{item.icon}</NavItemIcon>
                  <ListItemText>
                    <NavItemText $isSelected={isSelected}>{item.text}</NavItemText>
                  </ListItemText>
                </NavItemButton>
              </ListItem>
            );
          })}
        </NavList>
      </StyledDrawer>

      {/* Main Content Area */}
      <MainContent as="main">
        <Outlet />
      </MainContent>
    </RootContainer>
  );
};

export default Layout;
