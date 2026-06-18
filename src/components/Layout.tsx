import type { FC } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';

const DRAWER_WIDTH = 260;

const Layout: FC = () => {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', path: '/', icon: <DashboardRoundedIcon /> },
    { text: 'Employees', path: '/employees', icon: <PeopleAltRoundedIcon /> },
    { text: 'Insights', path: '/insights', icon: <AnalyticsRoundedIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header (AppBar) */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
            {menuItems.find((item) => item.path === location.pathname)?.text || 'Salary Management'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation (Drawer) */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          },
        }}
      >
        {/* Sidebar Header / Logo */}
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.contrastText',
              fontWeight: 700,
              fontSize: '1.1rem',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
            }}
          >
            S
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            SalarySync
          </Typography>
        </Box>
        <Divider />

        {/* Navigation Items */}
        <List sx={{ px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {menuItems.map((item) => {
            const isSelected =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isSelected}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    px: 2,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText',
                      },
                    },
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isSelected ? 'primary.contrastText' : 'text.secondary',
                      transition: 'color 0.2s ease-in-out',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText>
                    <Typography
                      sx={{
                        fontWeight: isSelected ? 600 : 500,
                        fontSize: '0.925rem',
                        color: isSelected ? 'primary.contrastText' : 'text.primary',
                      }}
                    >
                      {item.text}
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px', // Offset for the fixed AppBar height
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
