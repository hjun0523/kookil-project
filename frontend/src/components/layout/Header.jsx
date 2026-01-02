import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box, Container,
  InputBase, Drawer, List, ListItem, ListItemButton, ListItemText, Divider,
  useScrollTrigger
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';

import axiosClient from '../../api/axiosClient';

// 검색창 스타일
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

  // 스크롤 감지 트리거 (스크롤 내리면 true)
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  useEffect(() => {
    axiosClient.get('/menus')
      .then((res) => {
        const visibleMenus = res.filter(menu => menu.isVisible);
        setMenuItems(visibleMenus);
      })
      .catch((err) => console.error(err));

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
    // 👇 불필요한 Box Wrapper 제거하고 React Fragment 사용 권장 (혹은 Box 유지하되 flexGrow 제거)
    <Box sx={{ flexGrow: 1 }}> 
      {/* ★ [핵심 수정] position="fixed" 
        - 화면 스크롤과 무관하게 뷰포트 최상단에 '못 박듯이' 고정됩니다.
        - width: '100%'를 주어 가로폭이 줄어드는 것을 방지합니다.
      */}
      <AppBar 
        position="fixed" 
        color="inherit" 
        elevation={trigger ? 4 : 0} 
        sx={{ 
          top: 0, 
          left: 0,
          right: 0,
          width: '100%', // fixed 시 너비 확보 필수
          bgcolor: 'white', 
          borderBottom: trigger ? 'none' : '1px solid #eee', 
          transition: 'all 0.3s ease', 
          zIndex: 1100 
        }}
      >
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

            {/* 로고 영역 */}
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

            {/* 검색창 */}
            <Box sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }}>
               <Search>
                <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
                <StyledInputBase placeholder="장비명, 제조사를 입력하세요" />
              </Search>
            </Box>

            {/* PC 메뉴 */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 2, overflowX: 'auto' }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.id || item.name} 
                  onClick={() => handleNavClick(item.url)}
                  sx={{ 
                    color: location.pathname === item.url ? '#1A237E' : 'text.primary', 
                    fontWeight: location.pathname === item.url ? 'bold' : 'normal',
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',   
                    minWidth: 'auto',       
                    px: 1.5,                
                    '&:hover': { color: '#1A237E', bgcolor: 'rgba(0,0,0,0.04)' }
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
            
            {/* 우측 아이콘 */}
            <Box sx={{ flexGrow: 0, display: 'flex', gap: 1, ml: 2 }}>
               <IconButton color="inherit" sx={{ display: { xs: 'flex', sm: 'none' } }}><SearchIcon /></IconButton>
               <IconButton color="inherit" onClick={() => navigate('/k-manager/login')}><PersonIcon /></IconButton>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {/* ★ [중요] Spacer (받침대) 
        AppBar가 fixed가 되면 공중에 뜨기 때문에, 그 아래 내용(배너 등)이 
        헤더 뒤로 숨어버립니다. 이를 방지하기 위해 빈 Toolbar를 하나 두어
        헤더 높이만큼 공간을 미리 차지하게 합니다.
      */}
      <Toolbar sx={{ height: 70 }} />

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