// src/context/ThemeContext.jsx
import React from 'react';
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme'; // 위에서 만든 테마 import

export const ThemeProvider = ({ children }) => {
  return (
    <MUIThemeProvider theme={theme}>
      {/* CssBaseline: 브라우저 기본 스타일 초기화 (Normalize.css 역할) */}
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};