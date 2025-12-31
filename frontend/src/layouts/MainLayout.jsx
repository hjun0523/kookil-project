// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. 상단 헤더 */}
      <Header />

      {/* 2. 메인 콘텐츠 영역 */}
      {/* flexGrow: 1을 주어 내용이 적어도 푸터가 하단에 붙도록 설정 */}
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        {/* Outlet: 라우터에 의해 각 페이지 컴포넌트(HomePage, ProductList 등)가 들어오는 자리 */}
        <Outlet />
      </Box>

      {/* 3. 하단 푸터 */}
      <Footer />
    </Box>
  );
};

export default MainLayout;