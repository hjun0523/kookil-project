import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box, Container,
  InputBase, Drawer, List, ListItem, ListItemButton, ListItemText, Divider
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';

import axiosClient from '../../api/axiosClient';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': { backgroundColor: alpha(theme.palette.common.black, 0.1) },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: { marginLeft: theme.spacing(3), width: 'auto', minWidth: '300px' },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2), height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit', width: '100%', '& .MuiInputBase-input': { padding: theme.spacing(1, 1, 1, 0), paddingLeft: `calc(1em + ${theme.spacing(4)})`, transition: theme.transitions.create('width'), width: '100%' },
}));

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    // 메뉴 로딩
    axiosClient.get('/menus')
      .then((res) => {
        const visibleMenus = res.filter(menu => menu.isVisible);
        setMenuItems(visibleMenus);
      })
      .catch((err) => console.error(err));

    // 로고 로딩
    axiosClient.get('/banners?type=LOGO')
      .then((res) => {
        const activeLogo = res.find(b => b.isVisible);
        if (activeLogo) {
          setLogoUrl(activeLogo.imageUrl);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ py: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
         {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Logo" 
              style={{ maxHeight: 40, maxWidth: 180, cursor: 'pointer', objectFit: 'contain' }} 
              onClick={() => handleNavClick('/')} 
            />
         ) : (
            <Typography variant="h6" color="primary" fontWeight="bold" onClick={() => handleNavClick('/')}>
              (주)국일기계
            </Typography>
         )}
        <IconButton sx={{ position: 'absolute', right: 8 }} onClick={handleDrawerToggle}>
           <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id || item.name} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={() => handleNavClick(item.url)}>
              <ListItemText primary={item.name} primaryTypographyProps={{ fontWeight: 'medium' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" color="inherit" sx={{ top: 0, boxShadow: 1 }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 70 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* 로고 영역 (PC) */}
            <Box 
              onClick={() => navigate('/')} 
              sx={{ mr: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', minWidth: 150 }}
            >
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Logo" 
                  style={{ maxHeight: 50, maxWidth: 200, objectFit: 'contain' }} 
                />
              ) : (
                <Typography
                  variant="h5"
                  noWrap
                  component="div"
                  sx={{
                    fontWeight: 800,
                    color: '#1A237E', 
                    textDecoration: 'none',
                    letterSpacing: '-1px'
                  }}
                >
                  (주) 국일기계
                </Typography>
              )}
            </Box>

            <Box sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }}>
               <Search>
                <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
                <StyledInputBase placeholder="장비명, 제조사를 입력하세요" />
              </Search>
            </Box>

            {/* PC 메뉴 버튼 영역 */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 2, overflowX: 'auto' }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.id || item.name} 
                  onClick={() => handleNavClick(item.url)}
                  sx={{ 
                    color: location.pathname === item.url ? '#1A237E' : 'text.primary', 
                    fontWeight: location.pathname === item.url ? 'bold' : 'normal',
                    fontSize: '1rem',
                    
                    // 👇 [수정] 줄바꿈 방지 스타일 적용
                    whiteSpace: 'nowrap',   // 텍스트 한 줄로 강제
                    minWidth: 'auto',       // 불필요한 여백 제거
                    px: 1.5,                // 좌우 패딩 적절히 조절
                    
                    '&:hover': { color: '#1A237E', bgcolor: 'rgba(0,0,0,0.04)' }
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
            
            <Box sx={{ flexGrow: 0, display: 'flex', gap: 1, ml: 2 }}>
               <IconButton color="inherit" sx={{ display: { xs: 'flex', sm: 'none' } }}><SearchIcon /></IconButton>
               <IconButton color="inherit"><PersonIcon /></IconButton>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 } }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default Header;