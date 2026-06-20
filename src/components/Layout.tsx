import { useState } from 'react';
import type { FC } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import {
  RootContainer,
  StyledAppBar,
  StyledToolbar,
  Title,
  MenuButton,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const menuItems = [
    { text: 'Dashboard', path: '/', icon: <DashboardRoundedIcon /> },
    { text: 'Employees', path: '/employees', icon: <PeopleAltRoundedIcon /> },
    { text: 'Insights', path: '/insights', icon: <AnalyticsRoundedIcon /> },
  ];

  const drawerContent = (
    <>
      {/* Sidebar Header / Logo */}
      <LogoContainer>
        <LogoIcon aria-hidden="true">S</LogoIcon>
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
                onClick={() => setMobileOpen(false)}
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
    </>
  );

  return (
    <RootContainer>
      {/* Header (AppBar) */}
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <MenuButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuRoundedIcon />
          </MenuButton>
          <Title variant="h4">
            {menuItems.find((item) => item.path === location.pathname)?.text || 'Salary Management'}
          </Title>
        </StyledToolbar>
      </StyledAppBar>

      {/* Mobile Navigation Drawer */}
      <StyledDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        $isMobile
      >
        {drawerContent}
      </StyledDrawer>

      {/* Desktop Navigation Drawer */}
      <StyledDrawer variant="permanent" $isMobile={false}>
        {drawerContent}
      </StyledDrawer>

      {/* Main Content Area */}
      <MainContent as="main">
        <Outlet />
      </MainContent>
    </RootContainer>
  );
};

export default Layout;
