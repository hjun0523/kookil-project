import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, Container, Typography, Card, CardMedia, CardContent, 
  Chip, Button, IconButton, Skeleton, Tooltip, Pagination, Stack 
} from '@mui/material';
import Grid from '@mui/material/Grid2'; 

// 아이콘 임포트
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'; 
import ConstructionIcon from '@mui/icons-material/Construction'; 
import AgricultureIcon from '@mui/icons-material/Agriculture'; 
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; 
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest'; 
import FactoryIcon from '@mui/icons-material/Factory'; 
import ContentCutIcon from '@mui/icons-material/ContentCut'; 
import BoltIcon from '@mui/icons-material/Bolt'; 
import AppsIcon from '@mui/icons-material/Apps';
import AddIcon from '@mui/icons-material/Add';      
import RemoveIcon from '@mui/icons-material/Remove'; 

import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

// 상세 팝업 및 카드 컴포넌트 임포트
import ProductCard from '../../components/product/ProductCard'; 
import ProductDetailDialog from '../../components/product/ProductDetailDialog';

// --- 스타일 정의 ---
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  backgroundColor: '#f5f5f5', 
  marginBottom: theme.spacing(4),
  minHeight: '200px'
}));

const BannerWrapper = styled(Box)(({ theme }) => ({
  height: '380px', 
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '0 0 16px 16px',
  [theme.breakpoints.down('sm')]: {
    height: '200px',
    borderRadius: 0,
  }
}));

const HeroSlide = styled(Box)(({ theme, active }) => ({
  position: 'absolute',
  top: 0, left: 0, width: '100%', height: '100%',
  backgroundSize: '100% 100%', 
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  opacity: active ? 1 : 0,
  transition: 'opacity 0.8s ease-in-out', 
  zIndex: active ? 1 : 0,
}));

const ArrowButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'white',
  backgroundColor: 'rgba(0,0,0,0.2)', 
  padding: '12px',
  zIndex: 20,
  transition: 'all 0.3s ease',
  opacity: 0, 
  '&:hover': { backgroundColor: 'rgba(26, 35, 126, 0.9)', opacity: 1 }
}));

const CategoryButton = styled(Box)(({ theme, active }) => ({
  padding: theme.spacing(0.5), 
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '75px', 
  border: active ? '2px solid #1A237E' : '1px solid #eee', 
  backgroundColor: active ? '#1A237E' : '#fff', 
  color: active ? '#fff' : '#555', 
  boxShadow: active ? '0 4px 10px rgba(26, 35, 126, 0.3)' : 'none',
  '&:hover': {
    transform: 'translateY(-2px)',
    borderColor: '#1A237E',
    color: active ? '#fff' : '#1A237E', 
    backgroundColor: active ? '#1A237E' : '#f5f5f5',
  }
}));

const getCategoryIcon = (name) => {
  const props = { fontSize: "medium" }; 
  if (name.includes('머시닝') || name.includes('CNC')) return <PrecisionManufacturingIcon {...props} />;
  if (name.includes('밀링') || name.includes('선반')) return <ConstructionIcon {...props} />;
  if (name.includes('절단') || name.includes('톱')) return <ContentCutIcon {...props} />;
  if (name.includes('전기') || name.includes('전자')) return <BoltIcon {...props} />;
  if (name.includes('운반') || name.includes('지게차')) return <LocalShippingIcon {...props} />;
  if (name.includes('공장') || name.includes('설비')) return <FactoryIcon {...props} />;
  if (name.includes('부품') || name.includes('공구')) return <SettingsSuggestIcon {...props} />;
  return <AppsIcon {...props} />; 
};

const HomePage = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]); 
  
  // 👇 [수정] 데이터 관련 상태 변경 (서버 페이징 대응)
  const [products, setProducts] = useState([]); // 현재 페이지 데이터만 저장
  const [totalPages, setTotalPages] = useState(1);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('ALL');
  const [isExpanded, setIsExpanded] = useState(false);

  // 페이지네이션 상태
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 8; // 한 페이지당 8개

  // 상세 팝업 상태
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const slideInterval = useRef(null);

  // 1. 초기 로딩 (배너, 카테고리)
  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const [bannerRes, categoryRes] = await Promise.all([
          axiosClient.get('/banners?type=MAIN'),
          axiosClient.get('/categories')
        ]);
        
        const visibleBanners = bannerRes.filter(b => b.isVisible);
        setBanners(visibleBanners.length > 0 ? visibleBanners : [{ id: 'def', imageUrl: 'https://via.placeholder.com/1920x500' }]);
        setCategories(categoryRes.filter(c => c.isVisible).sort((a, b) => a.orderIndex - b.orderIndex));
      } catch (err) {
        console.error("초기 데이터 로딩 실패:", err);
      }
    };
    fetchInitData();
  }, []);

  // 2. 매물 데이터 로딩 (페이징 + 필터링 적용)
  // 👇 [수정] page나 category가 바뀔 때마다 서버에 요청하도록 변경
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // API 요청 파라미터 구성
        let url = `/products?page=${page - 1}&size=${ITEMS_PER_PAGE}`;
        if (selectedCategoryId !== 'ALL') {
          url += `&categoryId=${selectedCategoryId}`;
        }

        const res = await axiosClient.get(url);
        
        // 👇 [핵심 수정] 응답 구조가 Page 객체이므로 content를 뽑아서 사용
        console.log("홈 매물 로드:", res);
        setProducts(res.content || []); 
        setTotalPages(res.totalPages || 1);

      } catch (err) {
        console.error("매물 데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, selectedCategoryId]);

  // 배너 슬라이드
  useEffect(() => {
    if (banners.length <= 1) return;
    const startSlide = () => {
      slideInterval.current = setInterval(() => {
        if (!isHovered) setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000); 
    };
    startSlide();
    return () => clearInterval(slideInterval.current);
  }, [banners.length, isHovered]);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  const handleDotClick = (index) => setCurrentIndex(index);
  
  const handleCategoryChange = (id) => {
    setSelectedCategoryId(id);
    setPage(1); // 카테고리 변경 시 1페이지로 리셋
  };
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  // 페이지 변경 핸들러
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // 상세 팝업 핸들러
  const handleProductClick = (id) => {
    setSelectedProductId(id);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedProductId(null);
  };

  const ITEMS_PER_ROW_CAT = 8;
  const CATS_TO_SHOW = ITEMS_PER_ROW_CAT - 2;

  return (
    <Box>
      {/* 1. 메인 배너 */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ px: { xs: 0, md: '24px' } }}>
          {banners.length === 0 ? (
            <Skeleton variant="rectangular" width="100%" height={380} sx={{ borderRadius: '0 0 16px 16px', bgcolor: '#e0e0e0' }} />
          ) : (
            <BannerWrapper onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              {banners.map((banner, index) => (
                <HeroSlide key={banner.id} active={index === currentIndex ? 1 : 0} sx={{ backgroundImage: `url(${banner.imageUrl})` }} />
              ))}
              {banners.length > 1 && (
                <>
                  <ArrowButton onClick={handlePrev} sx={{ left: 20, opacity: isHovered ? 1 : 0 }}><ArrowBackIosNewIcon /></ArrowButton>
                  <ArrowButton onClick={handleNext} sx={{ right: 20, opacity: isHovered ? 1 : 0 }}><ArrowForwardIosIcon /></ArrowButton>
                  <Box sx={{ position: 'absolute', bottom: 15, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1, zIndex: 20 }}>
                    {banners.map((_, index) => (
                      <Box key={index} onClick={() => handleDotClick(index)} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }} />
                    ))}
                  </Box>
                </>
              )}
            </BannerWrapper>
          )}
        </Container>
      </HeroSection>
      
      {/* 2. 카테고리 및 매물 리스트 */}
      <Container maxWidth="lg" sx={{ mb: 10, mt: -2 }}>
        
        {/* (A) 카테고리 선택 영역 */}
        <Box sx={{ mb: 4 }}>
           {categories.length === 0 ? (
             <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
                {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} variant="rounded" width={100} height={75} />)}
             </Box>
           ) : (
             <Grid container spacing={1}>
                <Grid size={{ xs: 4, sm: 2, md: 1.5 }}>
                  <CategoryButton active={selectedCategoryId === 'ALL' ? 1 : 0} onClick={() => handleCategoryChange('ALL')}>
                    <Box sx={{ mb: 0.5 }}><AppsIcon fontSize="medium" color="inherit" /></Box>
                    <Typography variant="caption" fontWeight="bold">전체제품</Typography>
                  </CategoryButton>
                </Grid>
                {(isExpanded ? categories : categories.slice(0, CATS_TO_SHOW)).map((cat) => (
                  <Grid size={{ xs: 4, sm: 2, md: 1.5 }} key={cat.id}>
                    <CategoryButton active={selectedCategoryId === cat.id ? 1 : 0} onClick={() => handleCategoryChange(cat.id)}>
                      <Box sx={{ mb: 0.5 }}>{getCategoryIcon(cat.name)}</Box>
                      <Tooltip title={cat.name} arrow>
                        <Typography variant="caption" fontWeight="bold" sx={{ width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center', fontSize: '0.75rem' }}>{cat.name}</Typography>
                      </Tooltip>
                    </CategoryButton>
                  </Grid>
                ))}
                {categories.length > CATS_TO_SHOW && (
                  <Grid size={{ xs: 4, sm: 2, md: 1.5 }}>
                    <CategoryButton onClick={toggleExpand}>
                      <Box sx={{ mb: 0.5, bgcolor: isExpanded ? '#ffebee' : '#f3e5f5', borderRadius: '50%', p: 0.5, display: 'flex' }}>
                         {isExpanded ? <RemoveIcon color="error" fontSize="small" /> : <AddIcon color="secondary" fontSize="small" />}
                      </Box>
                      <Typography variant="caption" fontWeight="bold" color={isExpanded ? "error" : "secondary"}>{isExpanded ? "접기" : "더보기"}</Typography>
                    </CategoryButton>
                  </Grid>
                )}
             </Grid>
           )}
        </Box>

        {/* (B) 매물 리스트 */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, borderBottom: '2px solid #333', pb: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="#333">
              {/* 카테고리 이름 찾기 */}
              {selectedCategoryId === 'ALL' ? '실시간 등록 매물' : 
                (categories.find(c => c.id === selectedCategoryId)?.name || '매물 리스트')
              }
            </Typography>
            <Button size="small" onClick={() => navigate('/product')}>더보기 +</Button>
          </Box>

          {loading ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
                  <Card sx={{ height: '100%' }}>
                    <Skeleton variant="rectangular" height={200} animation="wave" />
                    <CardContent>
                      <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
                      <Skeleton width="80%" height={30} sx={{ mb: 1 }} />
                      <Skeleton width="40%" height={30} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <>
              {products.length === 0 ? (
                <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#f9f9f9', borderRadius: 2 }}>
                  <Typography color="text.secondary">등록된 매물이 없습니다.</Typography>
                </Box>
              ) : (
                // 👇 [수정] Grid Layout: lg={3} 적용하여 한 줄에 4개 표시
                <Grid container spacing={3} sx={{ minHeight: '400px' }}>
                  {products.map((item) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
                      <ProductCard 
                        item={item} 
                        onClick={() => handleProductClick(item.id)} 
                      />
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* 페이지네이션 컨트롤 */}
              {totalPages > 1 && (
                <Stack spacing={2} sx={{ mt: 4, alignItems: 'center' }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary" 
                    size="large"
                    showFirstButton 
                    showLastButton
                  />
                </Stack>
              )}
            </>
          )}
        </Box>
      </Container>

      {/* 4. 회사 소개 배너 */}
      <Box sx={{ bgcolor: '#eceff1', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>믿을 수 있는 중고 기계 거래, 국일기계</Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>30년 전통의 노하우로 엄선된 장비만을 취급합니다.<br />구매부터 설치, 시운전까지 완벽하게 지원해 드립니다.</Typography>
          <Button variant="outlined" size="large" sx={{ borderColor: '#1A237E', color: '#1A237E' }} onClick={() => navigate('/company')}>회사 소개 더보기</Button>
        </Container>
      </Box>
      
      {/* 상세 정보 팝업 컴포넌트 */}
      <ProductDetailDialog 
        open={openDetail} 
        productId={selectedProductId} 
        onClose={handleCloseDetail} 
      />

    </Box>
  );
};

export default HomePage;