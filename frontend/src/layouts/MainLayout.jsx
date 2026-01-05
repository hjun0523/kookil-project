import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Fab, Tooltip, Zoom, useScrollTrigger, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// 아이콘 임포트
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'; // 카톡 대체 아이콘
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// --- 스타일 정의 ---

// 1. Top 버튼 스타일
const StyledTopButton = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 40, 
  right: 40, 
  zIndex: 990, // 상담 버튼보다 아래에 위치
  width: 50, 
  height: 50,
  backgroundColor: '#fff', 
  color: '#1A237E',
  border: '1px solid #e0e0e0',
  borderRadius: '50%', // 다시 원형으로 변경 (상담 버튼과 구분감)
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  cursor: 'pointer', 
  transition: 'all 0.3s ease',
  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 6px 16px rgba(0,0,0,0.15)' },
}));

// 2. 상담 버튼 공통 스타일 (확장형 Fab)
const ConsultFab = styled(Fab)(({ theme, bgcolor, textcolor }) => ({
  backgroundColor: bgcolor,
  color: textcolor,
  fontWeight: 'bold',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  height: '48px', // 높이 고정
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  '&:hover': {
    backgroundColor: bgcolor,
    filter: 'brightness(0.95)', // 호버 시 살짝 어둡게
  },
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
  },
}));

// --- ScrollTop 컴포넌트 ---
function ScrollTop(props) {
  const { window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 300,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <StyledTopButton onClick={handleClick} role="presentation">
        <KeyboardArrowUpIcon />
      </StyledTopButton>
    </Zoom>
  );
}

const MainLayout = (props) => {
  
  // 전화 상담 연결
  const handleCall = () => {
    window.location.href = "tel:1599-1539"; 
  };

  // 카카오톡 상담 연결 (준비 중)
  const handleKakao = () => {
    // 나중에 실제 카카오톡 채널 URL이 생기면 아래 주석을 풀고 링크를 넣으세요.
    // window.open('http://pf.kakao.com/_xxxx/chat', '_blank');
    alert("카카오톡 상담 기능은 준비 중입니다.\n전화 상담을 이용해 주세요.");
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      
      {/* 스크롤 기준점 */}
      <div id="back-to-top-anchor" />

      <Header />

      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Box>

      <Footer />

      {/* 👇 [핵심 수정] 우측 하단 플로팅 버튼 그룹 */}
      <Stack 
        direction="column" 
        spacing={2} 
        alignItems="flex-end"
        sx={{
          position: 'fixed',
          bottom: 110, // Top 버튼(40px) 위로 띄움
          right: 40,
          zIndex: 9999,
        }}
      >
        {/* 1. 카카오톡 상담 버튼 (노란색) */}
        <Tooltip title="카카오톡 1:1 상담 (준비중)" placement="left" arrow>
          <ConsultFab 
            variant="extended" 
            bgcolor="#FEE500" 
            textcolor="#000000"
            onClick={handleKakao}
          >
            <ChatBubbleIcon fontSize="small" />
            <Typography variant="button" sx={{ fontWeight: 'bold' }}>
              카톡 상담
            </Typography>
          </ConsultFab>
        </Tooltip>

        {/* 2. 전화 상담 버튼 (초록색) */}
        <Tooltip title="전화 상담 바로가기" placement="left" arrow>
          <ConsultFab 
            variant="extended" 
            bgcolor="#00c853" 
            textcolor="#ffffff"
            onClick={handleCall}
          >
            <PhoneInTalkIcon fontSize="small" />
            <Typography variant="button" sx={{ fontWeight: 'bold' }}>
              전화 상담
            </Typography>
          </ConsultFab>
        </Tooltip>
      </Stack>

      {/* 3. Top 버튼 (맨 아래) */}
      <ScrollTop {...props} />

    </Box>
  );
};

export default MainLayout;