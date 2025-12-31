import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 로그아웃: 토큰 삭제 후 로그인 페이지로 이동
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('USER_ROLE');
    navigate('/k-manager/login');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        👋 관리자님, 환영합니다!
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 5 }}>
        이곳은 일반 사용자는 접근할 수 없는 통제 구역입니다.
      </Typography>
      
      <Button variant="contained" color="error" onClick={handleLogout}>
        로그아웃
      </Button>
    </Container>
  );
};

export default AdminDashboard;