import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Chip, Divider, 
  Table, TableBody, TableCell, TableContainer, TableRow, Paper, 
  Tabs, Tab, Stack, Avatar, CircularProgress, 
  Dialog, DialogContent, AppBar, Toolbar, IconButton, Slide, Fade 
} from '@mui/material';
import Grid from '@mui/material/Grid2'; 
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn'; // 돋보기 아이콘
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'; // 좌측 화살표
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // 우측 화살표
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import axiosClient from '../../api/axiosClient';

// 모바일용 슬라이드 트랜지션
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProductDetailDialog = ({ open, productId, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md')); 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // 👇 [추가] 이미지 확대 보기(Lightbox) 상태 관리
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 다이얼로그가 열릴 때 데이터 로드
  useEffect(() => {
    if (open && productId) {
      setLoading(true);
      axiosClient.get(`/products/${productId}`)
        .then((res) => {
          setProduct(res);
          if (res.images && res.images.length > 0) {
            setSelectedImg(res.images[0]);
          }
        })
        .catch((err) => {
          console.error("상세 조회 실패:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, productId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCall = () => {
     window.location.href = "tel:1599-1539"; 
  };

  // 👇 [추가] 이미지 클릭 시 확대 뷰 열기
  const handleImageClick = () => {
    // 현재 보고 있는 이미지가 전체 리스트에서 몇 번째인지 찾음
    const index = product.images.findIndex(img => img === selectedImg);
    setCurrentImageIndex(index !== -1 ? index : 0);
    setLightboxOpen(true);
  };

  // 👇 [추가] 확대 뷰 닫기
  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  // 👇 [추가] 이전/다음 이미지 이동
  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };


  // 로딩 화면
  if (loading && open) {
    return (
      <Dialog fullScreen={fullScreen} open={open} onClose={onClose} TransitionComponent={Transition}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      </Dialog>
    );
  }

  if (!product) return null;

  return (
    <>
      <Dialog 
        fullScreen={fullScreen} 
        open={open} 
        onClose={onClose} 
        TransitionComponent={Transition}
        maxWidth="lg"
        fullWidth
      >
        {/* 1. 모바일용 헤더 / PC용 닫기 버튼 */}
        {fullScreen ? (
          <AppBar sx={{ position: 'relative', bgcolor: '#1A237E' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                매물 상세 정보
              </Typography>
            </Toolbar>
          </AppBar>
        ) : (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
              zIndex: 10
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        {/* 2. 컨텐츠 영역 */}
        <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
          <Grid container spacing={4}>
            
            {/* 좌측: 이미지 */}
            <Grid size={{ xs: 12, md: 7 }}>
              
              {/* 메인 이미지 영역 (클릭 가능하도록 개선) */}
              <Box 
                onClick={handleImageClick} // 👈 클릭 이벤트 추가
                sx={{ 
                  width: '100%', 
                  height: { xs: 300, md: 450 }, 
                  bgcolor: '#eee', 
                  borderRadius: 2, 
                  overflow: 'hidden', 
                  mb: 2, 
                  border: '1px solid #ddd',
                  position: 'relative', // 아이콘 배치를 위해 relative
                  cursor: 'pointer', // 커서 변경
                  '&:hover .zoom-icon': { opacity: 1 }, // 호버 시 아이콘 표시
                  '&:hover img': { transform: 'scale(1.02)' } // 호버 시 살짝 확대 효과
                }}
              >
                <img 
                  src={selectedImg || 'https://via.placeholder.com/600x400?text=No+Image'} 
                  alt="Main" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain', 
                    backgroundColor: '#f9f9f9',
                    transition: 'transform 0.3s ease' 
                  }} 
                />
                
                {/* 돋보기 아이콘 오버레이 */}
                <Box 
                  className="zoom-icon"
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    borderRadius: '50%',
                    p: 1,
                    opacity: 0.7,
                    transition: 'opacity 0.3s',
                    display: 'flex'
                  }}
                >
                  <ZoomInIcon />
                </Box>
              </Box>

              {/* 썸네일 리스트 */}
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                {product.images && product.images.map((img, idx) => (
                  <Box 
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    sx={{ 
                      width: 80, height: 80, flexShrink: 0, borderRadius: 2, overflow: 'hidden', cursor: 'pointer',
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
                  label={product.status === 'SALE' ? '판매중' : product.status === 'SOLD_OUT' ? '매각완료' : '예약중'} 
                  color={product.status === 'SALE' ? 'primary' : 'default'} 
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
                  {product.isPriceOpen ? `${product.price.toLocaleString()}원` : '가격협의'}
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
                  <Button variant="contained" size="large" fullWidth startIcon={<PhoneIcon />} onClick={handleCall} sx={{ bgcolor: '#1A237E', height: 50, fontSize: '1.1rem' }}>
                    판매자에게 전화
                  </Button>
                  <Button variant="outlined" size="large" fullWidth startIcon={<ChatIcon />} sx={{ height: 50, fontSize: '1.1rem' }}>
                    견적 문의
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* 하단 상세 탭 */}
          <Box sx={{ mt: 6 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="상세 제원 (Spec)" />
                <Tab label="장비 설명" />
                <Tab label="판매자 정보" />
              </Tabs>
            </Box>

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
                      <TableCell>{product.categoryName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ bgcolor: '#f9f9f9', fontWeight: 'bold' }}>기본사양</TableCell>
                      <TableCell>{product.basicSpec}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box hidden={tabValue !== 1} sx={{ py: 3, minHeight: 200 }}>
               <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                 {product.description}
               </Typography>
            </Box>
            
             <Box hidden={tabValue !== 2} sx={{ py: 3 }}>
               <Stack direction="row" spacing={2} alignItems="center">
                 <Avatar sx={{ width: 60, height: 60, bgcolor: '#1A237E' }}>국일</Avatar>
                 <Box>
                   <Typography variant="h6" fontWeight="bold">(주)국일기계</Typography>
                   <Typography variant="body2" color="text.secondary">인천광역시 서구 백범로 776번지</Typography>
                 </Box>
               </Stack>
            </Box>
          </Box>
        </DialogContent>

        {fullScreen && (
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', p: 2, gap: 1, zIndex: 1300, borderTop: '1px solid #ddd' }} elevation={10}>
            <Button variant="outlined" fullWidth sx={{ flex: 1 }}>문자 문의</Button>
            <Button variant="contained" fullWidth color="primary" startIcon={<PhoneIcon />} onClick={handleCall} sx={{ flex: 2 }}>전화하기</Button>
          </Paper>
        )}
      </Dialog>

      {/* 👇 [신규 구현] 이미지 확대 보기 (Lightbox) 다이얼로그 */}
      <Dialog
        fullScreen
        open={lightboxOpen}
        onClose={handleCloseLightbox}
        sx={{ 
          '& .MuiDialog-paper': { bgcolor: 'black', color: 'white' } // 배경 검정색
        }}
      >
        {/* 닫기 버튼 */}
        <IconButton
          onClick={handleCloseLightbox}
          sx={{ position: 'absolute', top: 16, right: 16, color: 'white', zIndex: 2000 }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>

        <Box 
          sx={{ 
            width: '100%', height: '100%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative'
          }}
          onClick={handleCloseLightbox} // 배경 클릭 시 닫기
        >
          {/* 이미지 (클릭 전파 방지) */}
          {product.images && product.images.length > 0 && (
            <img 
              src={product.images[currentImageIndex]} 
              alt="Large View" 
              style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain' }}
              onClick={(e) => e.stopPropagation()} 
            />
          )}

          {/* 이전 버튼 (이미지가 여러 개일 때만) */}
          {product.images && product.images.length > 1 && (
            <IconButton
              onClick={handlePrevImage}
              sx={{ 
                position: 'absolute', left: 16, color: 'white', 
                bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' } 
              }}
            >
              <ArrowBackIosNewIcon fontSize="large" />
            </IconButton>
          )}

          {/* 다음 버튼 */}
          {product.images && product.images.length > 1 && (
            <IconButton
              onClick={handleNextImage}
              sx={{ 
                position: 'absolute', right: 16, color: 'white', 
                bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' } 
              }}
            >
              <ArrowForwardIosIcon fontSize="large" />
            </IconButton>
          )}
        </Box>
        
        {/* 하단 인디케이터 (1/5) */}
        {product.images && (
          <Box sx={{ position: 'absolute', bottom: 30, width: '100%', textAlign: 'center' }}>
            <Typography color="white" variant="subtitle1">
              {currentImageIndex + 1} / {product.images.length}
            </Typography>
          </Box>
        )}
      </Dialog>
    </>
  );
};

export default ProductDetailDialog;