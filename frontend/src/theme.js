// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1A237E', // 국일기계 Deep Navy
      light: '#534bae',
      dark: '#000051',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF6F00', // 강조용 Amber (문의하기, 구매하기 등)
    },
    background: {
      default: '#F4F6F8', // 전체 배경색 (연한 회색)
      paper: '#ffffff',   // 카드 배경색 (흰색)
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: [
      '"Pretendard"', // 한국어 웹폰트 표준 (없으면 아래 폰트로 대체)
      '"Roboto"',
      '"Helvetica"',
      '"Arial"',
      'sans-serif',
    ].join(','),
    h6: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // 버튼을 살짝 둥글게
          textTransform: 'none', // 대문자 강제 변환 해제
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none', // 모던함을 위해 기본 그림자 제거 (필요시 borderBottom 추가)
          borderBottom: '1px solid #e0e0e0',
        },
      },
    },
  },
});

export default theme;