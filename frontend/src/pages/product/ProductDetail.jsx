import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, Button, Chip, Divider, 
  Table, TableBody, TableCell, TableContainer, TableRow, Paper, 
  Tabs, Tab, Breadcrumbs, Link, Stack, Avatar, CircularProgress, Alert
} from '@mui/material';
import Grid from '@mui/material/Grid2'; 
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// API 클라이언트 import
import axiosClient from '../../api/axiosClient';

const ProductDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // 상태 관리
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedImg, setSelectedImg] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 백엔드 데이터 호출
  useEffect(() => {
    setLoading(true);
    // /api/products/{id} 호출
    axiosClient.get(`/products/${id}`)
      .then((res) => {
        console.log("상세 데이터:", res);
        setProduct(res);
        // 이미지가 있다면 첫 번째를 기본 선택
        if (res.images && res.images.length > 0) {
          setSelectedImg(res.images[0]);
        }
      })
      .catch((err) => {
        console.error("상세 조회 실패:", err);
        setError("매물 정보를 불러오지 못했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // 1. 로딩 중 화면
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  // 2. 에러 화면 (또는 데이터 없음)
  if (error || !product) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Alert severity="error" sx={{ justifyContent: 'center', mb: 2 }}>
          {error || "상품을 찾을 수 없습니다."}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/product')}>
          목록으로 돌아가기
        </Button>
      </Container>
    );
  }

  // 3. 정상 데이터 화면
  return (
    <Box sx={{ pb: 10 }}>
      
      {/* 상단 브레드크럼 */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 1.5 }}>
        <Container maxWidth="lg">
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
              홈
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/product')} sx={{ cursor: 'pointer' }}>
              전체매물
            </Link>
            <Typography color="text.primary">{product.category}</Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={5}>
          
          {/* 좌측: 이미지 갤러리 */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box 
              sx={{ 
                width: '100%', height: 400, bgcolor: '#eee', 
                borderRadius: 2, overflow: 'hidden', mb: 2, border: '1px solid #ddd'
              }}
            >
              <img 
                src={selectedImg || 'https://placehold.co/600x400?text=No+Image'} 
                alt="Main" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </Box>
            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
              {product.images && product.images.map((img, idx) => (
                <Box 
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  sx={{ 
                    width: 80, height: 80, borderRadius: 2, overflow: 'hidden', cursor: 'pointer',
                    border: selectedImg === img ? '2px solid #1A237E' : '1px solid #ddd',
                    opacity: selectedImg === img ? 1 : 0.6
                  }}
                >
                  <img src={img} alt={`thumb-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* 우측: 핵심 정보 */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box>
              <Chip 
                label={product.status === 'SALE' ? '판매중' : '판매완료'} 
                color="primary" 
                size="small" 
                sx={{ mb: 1, fontWeight: 'bold' }} 
              />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {product.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {product.manufacturer} | {product.modelYear}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h4" color="secondary" fontWeight="bold" sx={{ mb: 2 }}>
                {product.price.toLocaleString()}원
              </Typography>

              <Stack spacing={1} sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center">
                  <LocationOnIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">{product.location}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <CheckCircleIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">성능 점검 완료 / 시운전 가능</Typography>
                </Box>
              </Stack>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                <Button variant="contained" size="large" fullWidth startIcon={<PhoneIcon />} sx={{ bgcolor: '#1A237E', height: 50, fontSize: '1.1rem' }}>
                  판매자에게 전화
                </Button>
                <Button variant="outlined" size="large" fullWidth startIcon={<ChatIcon />} sx={{ height: 50, fontSize: '1.1rem' }}>
                  견적 문의
                </Button>
              </Box>
            </Box>
          </Grid>

        </Grid>

        {/* 하단 상세 정보 탭 */}
        <Box sx={{ mt: 8 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="상세 제원 (Spec)" />
              <Tab label="장비 설명" />
              <Tab label="판매자 정보" />
            </Tabs>
          </Box>

          {/* 탭 1: 스펙 */}
          <Box hidden={tabValue !== 0} sx={{ py: 3 }}>
            <TableContainer component={Paper} elevation={0} variant="outlined">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" sx={{ bgcolor: '#f9f9f9', width: '30%', fontWeight: 'bold' }}>제조사</TableCell>
                    <TableCell>{product.manufacturer}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ bgcolor: '#f9f9f9', fontWeight: 'bold' }}>모델명</TableCell>
                    <TableCell>{product.modelName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ bgcolor: '#f9f9f9', fontWeight: 'bold' }}>연식</TableCell>
                    <TableCell>{product.modelYear}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ bgcolor: '#f9f9f9', fontWeight: 'bold' }}>카테고리</TableCell>
                    <TableCell>{product.category}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* 탭 2: 설명 */}
          <Box hidden={tabValue !== 1} sx={{ py: 3, minHeight: 200 }}>
             <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
               {product.description}
             </Typography>
          </Box>
          
           {/* 탭 3: 판매자 정보 */}
           <Box hidden={tabValue !== 2} sx={{ py: 3 }}>
             <Stack direction="row" spacing={2} alignItems="center">
               <Avatar sx={{ width: 60, height: 60 }}>국일</Avatar>
               <Box>
                 <Typography variant="h6" fontWeight="bold">(주)국일기계</Typography>
                 <Typography variant="body2" color="text.secondary">인천광역시 서구 백범로 776번지</Typography>
               </Box>
             </Stack>
          </Box>
        </Box>

      </Container>
      
      {/* 모바일 하단바 (필요시 추가) */}
      <Paper 
        sx={{ 
          position: 'fixed', bottom: 0, left: 0, right: 0, 
          display: { xs: 'flex', md: 'none' }, p: 2, gap: 1, zIndex: 1000, borderTop: '1px solid #ddd'
        }} 
        elevation={3}
      >
        <Button variant="outlined" fullWidth sx={{ flex: 1 }}>
          문자 문의
        </Button>
        <Button variant="contained" fullWidth color="primary" startIcon={<PhoneIcon />} sx={{ flex: 2 }}>
          전화하기
        </Button>
      </Paper>

    </Box>
  );
};

export default ProductDetail;