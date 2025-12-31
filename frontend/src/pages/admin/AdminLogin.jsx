import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, TextField, Button, Paper, Alert 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axiosClient from '../../api/axiosClient';

const AdminLogin = () => {
  const navigate = useNavigate();
  
  // 입력값 상태
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. 백엔드로 로그인 요청
      const res = await axiosClient.post('/members/login', formData);
      
      // 2. 성공 시 토큰을 브라우저(LocalStorage)에 저장
      // res 구조: { grantType: "Bearer", accessToken: "...", role: "ROLE_ADMIN" }
      localStorage.setItem('ACCESS_TOKEN', res.accessToken);
      localStorage.setItem('USER_ROLE', res.role);

      console.log("로그인 성공! 토큰 저장 완료.");

      // 3. 관리자 대시보드로 이동
      navigate('/k-manager/dashboard');

    } catch (err) {
      console.error(err);
      setError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        bgcolor: '#f0f2f5' 
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <Box sx={{ p: 2, bgcolor: '#1A237E', borderRadius: '50%', mb: 2 }}>
            <LockOutlinedIcon sx={{ color: 'white', fontSize: 30 }} />
          </Box>
          
          <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            관리자 로그인
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="관리자 ID"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#1A237E', py: 1.5, fontSize: '1rem' }}
            >
              로그인
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;