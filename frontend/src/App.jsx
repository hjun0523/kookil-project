import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout'; // 👈 신규 레이아웃

// 사용자 페이지
import HomePage from './pages/home/HomePage';
import ProductList from './pages/product/ProductList';
import ProductDetail from './pages/product/ProductDetail';

// 관리자 페이지
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import MenuManagement from './pages/admin/menu/MenuManagement'; // 👈 신규 페이지
import BannerManagement from './pages/admin/banner/BannerManagement'; // 👈 추가
import CategoryManagement from './pages/admin/category/CategoryManagement'; // 👈 추가
import ProductManagement from './pages/admin/product/ProductManagement'; // 👈 추가

// 보호된 경로 (토큰 체크)
const ProtectedRoute = () => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  if (!token) return <Navigate to="/k-manager/login" replace />;
  return <Outlet />;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. 일반 사용자 영역 */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="product" element={<ProductList />} />
            <Route path="product/:id" element={<ProductDetail />} />
          </Route>

          {/* 2. 관리자 영역 */}
          <Route path="/k-manager/login" element={<AdminLogin />} />

          {/* 3. 관리자 보호 구역 (AdminLayout 적용) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/k-manager" element={<AdminLayout />}> {/* 👈 AdminLayout 감싸기 */}
              <Route index element={<Navigate to="/k-manager/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="menus" element={<MenuManagement />} /> {/* 👈 메뉴 관리 연결 */}
              <Route path="banners" element={<BannerManagement />} /> {/* 👈 추가 */}
              <Route path="categories" element={<CategoryManagement />} /> {/* 👈 라우트 연결 */}
              <Route path="products" element={<ProductManagement />} /> {/* 👈 추가 */}
              {/* 추후 여기에 배너, 매물, 카테고리 추가 */}
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;