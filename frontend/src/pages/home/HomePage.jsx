import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, Container, Typography, Card, CardMedia, CardContent, 
  Chip, Button, Paper, IconButton, Zoom, useScrollTrigger, Tooltip
} from '@mui/material';
import Grid from '@mui/material/Grid2'; 

// 아이콘 임포트
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
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

import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

// --- 스타일 정의 ---

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  backgroundColor: '#f5f5f5', 
  marginBottom: theme.spacing(4)
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

const StyledTopButton = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 40, right: 40, zIndex: 999,
  width: 55, height: 55,
  backgroundColor: '#1A237E', color: 'white',
  borderRadius: '12px',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  cursor: 'pointer', transition: 'all 0.3s ease',
  '&:hover': { transform: 'translateY(-5px)', backgroundColor: '#0d1b60' },
  '& .top-text': { fontSize: '10px', fontWeight: 'bold', marginTop: '-2px' }
}));

// 카테고리 버튼 사이즈 및 스타일 최적화 (Compact Mode)
const CategoryButton = styled(Box)(({ theme, active }) => ({
  padding: theme.spacing(0.5), // 패딩 최소화
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '75px', // 높이 대폭 축소
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

function ScrollTop(props) {
  const { window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 300,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
    if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <Zoom in={trigger}>
      <StyledTopButton onClick={handleClick} role="presentation">
        <KeyboardArrowUpIcon sx={{ fontSize: '28px' }} />
        <span className="top-text">TOP</span>
      </StyledTopButton>
    </Zoom>
  );
}

// 아이콘 매핑
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

const HomePage = (props) => {
  const navigate = useNavigate();

  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [allProducts, setAllProducts] = useState([]); 
  const [displayProducts, setDisplayProducts] = useState([]); 
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('ALL');

  // 카테고리 더보기 상태
  const [isExpanded, setIsExpanded] = useState(false);

  const slideInterval = useRef(null);

  useEffect(() => {
    // 1. 배너 로드
    axiosClient.get('/banners?type=MAIN')
      .then(res => {
        const visible = res.filter(b => b.isVisible);
        setBanners(visible.length > 0 ? visible : [{ id: 'def', imageUrl: 'https://via.placeholder.com/1920x500' }]);
      })
      .catch(err => console.error(err));

    // 2. 카테고리 로드
    axiosClient.get('/categories')
      .then(res => {
        const activeCats = res.filter(c => c.isVisible).sort((a, b) => a.orderIndex - b.orderIndex);
        setCategories(activeCats);
      })
      .catch(err => console.error(err));

    // 3. 전체 매물 로드
    axiosClient.get('/products')
      .then(res => {
        setAllProducts(res);
        setDisplayProducts(res.slice(0, 12)); 
      })
      .catch(err => console.error(err));
  }, []);

  // 카테고리 필터링 로직
  useEffect(() => {
    if (selectedCategoryId === 'ALL') {
      setDisplayProducts(allProducts.slice(0, 12)); 
    } else {
      const selectedCat = categories.find(c => c.id === selectedCategoryId);
      if (selectedCat) {
        const filtered = allProducts.filter(p => p.categoryName === selectedCat.name);
        setDisplayProducts(filtered);
      }
    }
  }, [selectedCategoryId, allProducts, categories]);

  // 배너 슬라이드 로직
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
  const handleCategoryChange = (id) => setSelectedCategoryId(id);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  // [로직] 한 줄에 8개 배치 (PC 기준 md=1.5)
  // [ALL] + [카테고리 6개] + [더보기] = 8개 (1줄)
  const ITEMS_PER_ROW = 8;
  const CATS_TO_SHOW = ITEMS_PER_ROW - 2; // ALL과 더보기 버튼을 뺀 나머지 슬롯 수

  return (
    <Box>
      <div id="back-to-top-anchor" />

      {/* 1. 메인 배너 */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ px: { xs: 0, md: '24px' } }}>
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
        </Container>
      </HeroSection>
      
      {/* 2. 카테고리 탭 + 매물 리스트 섹션 */}
      <Container maxWidth="lg" sx={{ mb: 10, mt: -2 }}>
        
        {/* (A) 카테고리 선택 영역 (Grid 간격 조정: spacing={1}) */}
        <Box sx={{ mb: 4 }}>
           <Grid container spacing={1}>
              {/* 1. 고정: 전체 제품 (md=1.5 -> 8개/줄) */}
              <Grid size={{ xs: 4, sm: 2, md: 1.5 }}>
                <CategoryButton 
                  active={selectedCategoryId === 'ALL' ? 1 : 0}
                  onClick={() => handleCategoryChange('ALL')}
                >
                  <Box sx={{ mb: 0.5 }}>
                    <AppsIcon fontSize="medium" color="inherit" />
                  </Box>
                  <Typography variant="caption" fontWeight="bold">전체제품</Typography>
                </CategoryButton>
              </Grid>

              {/* 2. 카테고리 리스트 (펼침 여부에 따라 갯수 조절) */}
              {(isExpanded ? categories : categories.slice(0, CATS_TO_SHOW)).map((cat) => (
                <Grid size={{ xs: 4, sm: 2, md: 1.5 }} key={cat.id}>
                  <CategoryButton 
                    active={selectedCategoryId === cat.id ? 1 : 0}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    <Box sx={{ mb: 0.5 }}>{getCategoryIcon(cat.name)}</Box>
                    <Tooltip title={cat.name} arrow>
                      <Typography 
                        variant="caption" 
                        fontWeight="bold" 
                        sx={{ 
                          width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', 
                          textOverflow: 'ellipsis', textAlign: 'center', fontSize: '0.75rem' 
                        }}
                      >
                        {cat.name}
                      </Typography>
                    </Tooltip>
                  </CategoryButton>
                </Grid>
              ))}

              {/* 3. 더보기 / 접기 버튼 (카테고리가 많을 때만 표시) */}
              {categories.length > CATS_TO_SHOW && (
                <Grid size={{ xs: 4, sm: 2, md: 1.5 }}>
                  <CategoryButton onClick={toggleExpand}>
                    <Box sx={{ mb: 0.5, bgcolor: isExpanded ? '#ffebee' : '#f3e5f5', borderRadius: '50%', p: 0.5, display: 'flex' }}>
                       {isExpanded ? 
                         <RemoveIcon color="error" fontSize="small" /> : 
                         <AddIcon color="secondary" fontSize="small" />
                       }
                    </Box>
                    <Typography variant="caption" fontWeight="bold" color={isExpanded ? "error" : "secondary"}>
                      {isExpanded ? "접기" : "더보기"}
                    </Typography>
                  </CategoryButton>
                </Grid>
              )}
           </Grid>
        </Box>

        {/* (B) 선택된 카테고리의 매물 리스트 영역 */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, borderBottom: '2px solid #333', pb: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="#333">
              {selectedCategoryId === 'ALL' 
                ? '실시간 등록 매물' 
                : `${categories.find(c => c.id === selectedCategoryId)?.name} 매물 리스트`}
            </Typography>
            <Button size="small" onClick={() => navigate('/product')}>
              더보기 +
            </Button>
          </Box>

          {/* 매물 그리드 */}
          {displayProducts.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#f9f9f9', borderRadius: 2 }}>
              <Typography color="text.secondary">등록된 매물이 없습니다.</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {displayProducts.map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
                  <Card 
                    onClick={() => navigate(`/product/${item.id}`)}
                    sx={{ 
                      height: '100%', display: 'flex', flexDirection: 'column', 
                      transition: '0.3s', cursor: 'pointer',
                      '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                       <Chip 
                        label={item.status === 'SALE' ? '판매중' : item.status === 'SOLD_OUT' ? '매각완료' : '예약중'} 
                        color={item.status === 'SALE' ? 'primary' : 'default'} 
                        size="small" 
                        sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }} 
                      />
                      <CardMedia 
                        component="img" 
                        height="200" 
                        image={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300?text=No+Image'} 
                        alt={item.title} 
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                         {item.categoryName} | {item.modelYear || '연식미상'}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, height: '3em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight="800">
                        {item.isPriceOpen ? `${item.price.toLocaleString()}원` : '가격협의'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>

      {/* 4. 회사 소개 배너 */}
      <Box sx={{ bgcolor: '#eceff1', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            믿을 수 있는 중고 기계 거래, 국일기계
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            30년 전통의 노하우로 엄선된 장비만을 취급합니다.<br />
            구매부터 설치, 시운전까지 완벽하게 지원해 드립니다.
          </Typography>
          <Button variant="outlined" size="large" sx={{ borderColor: '#1A237E', color: '#1A237E' }}>
            회사 소개 더보기
          </Button>
        </Container>
      </Box>

      {/* Top 버튼 */}
      <ScrollTop {...props} />
    </Box>
  );
};

export default HomePage;