import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Toolbar, AppBar, Button } from '@mui/material';

// 아이콘 임포트
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import ImageIcon from '@mui/icons-material/Image';
import LogoutIcon from '@mui/icons-material/Logout';
import MapIcon from '@mui/icons-material/Map'; // 👈 [추가] 지도 아이콘

const drawerWidth = 240;

// 메뉴 목록 정의
const MENU_ITEMS = [
  { text: '대시보드', icon: <DashboardIcon />, path: '/k-manager/dashboard' },
  { text: '메뉴 관리', icon: <MenuIcon />, path: '/k-manager/menus' },
  { text: '홈/배너 관리', icon: <ImageIcon />, path: '/k-manager/banners' },
  { text: '매물 관리', icon: <InventoryIcon />, path: '/k-manager/products' },
  { text: '카테고리 관리', icon: <CategoryIcon />, path: '/k-manager/categories' },
  { text: '회사 위치 관리', icon: <MapIcon />, path: '/k-manager/locations' }, // 👈 [추가] 신규 메뉴
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    // localStorage.removeItem('USER_ROLE'); // 필요 시 주석 해제
    navigate('/k-manager/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 상단 헤더 (App Bar) */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#1A237E' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            국일기계 관리자 시스템
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            로그아웃
          </Button>
        </Toolbar>
      </AppBar>
      
      {/* 좌측 사이드바 (Drawer) */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar /> {/* 헤더 높이만큼 띄우기 */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {MENU_ITEMS.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'rgba(26, 35, 126, 0.08)',
                      borderRight: '4px solid #1A237E',
                      '&:hover': { bgcolor: 'rgba(26, 35, 126, 0.12)' }
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: location.pathname === item.path ? '#1A237E' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: location.pathname === item.path ? 'bold' : 'medium',
                      color: location.pathname === item.path ? '#1A237E' : 'inherit'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      {/* 메인 콘텐츠 영역 */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Toolbar /> {/* 헤더에 가려지지 않게 여백 추가 */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;