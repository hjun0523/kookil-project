import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, Container, Typography, Card, CardMedia, CardContent, 
  Chip, Button, Paper, IconButton 
} from '@mui/material';
import Grid from '@mui/material/Grid2'; 
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';
import axiosClient from '../../api/axiosClient';

// 추천 매물 데이터
const RECOMMENDED_ITEMS = [
  { id: 1, title: '현대위아 5호기 머시닝센터 F500', price: '4,500만원', img: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=600&q=80', year: '2020년', status: 'SALE' },
  { id: 2, title: '두산공작기계 PUMA 280', price: '3,800만원', img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80', year: '2019년', status: 'SALE' },
  { id: 3, title: '화천 기계 CNC 선반 Hi-TECH', price: '5,200만원', img: 'https://images.unsplash.com/photo-1612056345934-2977755a9c3f?auto=format&fit=crop&w=600&q=80', year: '2021년', status: 'RESERVED' },
  { id: 4, title: '리프트 용접기 세트', price: '850만원', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80', year: '2018년', status: 'SALE' },
];

// Hero 섹션 컨테이너
const HeroContainer = styled(Box)(({ theme }) => ({
  // PC에서는 고정 높이 380px (사용자 요청)
  height: '380px', 
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#f5f5f5', // 이미지가 로딩되기 전 배경색
  
  // 모바일(xs)에서는 높이를 줄여서 비율 유지 (너무 길어지는 것 방지)
  [theme.breakpoints.down('sm')]: {
    height: '200px',
  }
}));

// 개별 슬라이드 (배경 이미지)
const HeroSlide = styled(Box)(({ theme, active }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  
  // 👇 [핵심 수정] 이미지를 강제로 늘려서 박스에 꽉 채움 (잘림 방지)
  backgroundSize: '100% 100%', 
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  
  opacity: active ? 1 : 0,
  transition: 'opacity 0.8s ease-in-out', // 부드러운 전환
  zIndex: active ? 1 : 0,
  
  // 오버레이 제거: 이미지 자체 색감을 살리기 위해 검은막 제거
  '&::before': {
    content: 'none', 
  }
}));

// 화살표 버튼 스타일
const ArrowButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'white',
  backgroundColor: 'rgba(0,0,0,0.2)', // 반투명 배경
  padding: '12px',
  zIndex: 20,
  transition: 'all 0.3s ease',
  opacity: 0, // 평소엔 숨김
  '&:hover': {
    backgroundColor: 'rgba(26, 35, 126, 0.9)', // 호버 시 진한 남색
    opacity: 1
  }
}));

const HomePage = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slideInterval = useRef(null);

  useEffect(() => {
    axiosClient.get('/banners?type=MAIN')
      .then(res => {
        const visibleBanners = res.filter(b => b.isVisible);
        if (visibleBanners.length === 0) {
          // 배너가 없을 때 보여줄 기본 이미지
          setBanners([{
            id: 'default',
            imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80',
          }]);
        } else {
          setBanners(visibleBanners);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    if (banners.length <= 1) return;

    const startSlide = () => {
      slideInterval.current = setInterval(() => {
        if (!isHovered) {
          setCurrentIndex((prev) => (prev + 1) % banners.length);
        }
      }, 5000); // 5초
    };

    startSlide();

    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [banners.length, isHovered]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <Box>
      {/* 1. 메인 배너 (Hero Section) */}
      <HeroContainer 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
        {banners.map((banner, index) => (
          <HeroSlide 
            key={banner.id} 
            active={index === currentIndex ? 1 : 0}
            sx={{ backgroundImage: `url(${banner.imageUrl})` }}
          />
        ))}

        {/* 좌우 화살표 (이미지가 2개 이상일 때만 표시) */}
        {banners.length > 1 && (
          <>
            <ArrowButton 
              onClick={handlePrev} 
              sx={{ left: 20, opacity: isHovered ? 1 : 0 }}
            >
              <ArrowBackIosNewIcon fontSize="medium" />
            </ArrowButton>
            <ArrowButton 
              onClick={handleNext} 
              sx={{ right: 20, opacity: isHovered ? 1 : 0 }}
            >
              <ArrowForwardIosIcon fontSize="medium" />
            </ArrowButton>
          </>
        )}

        {/* 텍스트(타이틀/설명) 레이어 제거됨: 이미지가 다 포함하므로 중복 제거 */}

        {/* 하단 인디케이터 (Dots) */}
        {banners.length > 1 && (
          <Box 
            sx={{ 
              position: 'absolute', bottom: 15, left: '50%', transform: 'translateX(-50%)', 
              display: 'flex', gap: 1, zIndex: 20,
              bgcolor: 'rgba(0,0,0,0.3)', px: 1.5, py: 0.5, borderRadius: 10 // 점이 잘 보이게 배경 추가
            }}
          >
            {banners.map((_, index) => (
              <Box
                key={index}
                onClick={() => handleDotClick(index)}
                sx={{
                  width: 10, height: 10, borderRadius: '50%',
                  bgcolor: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': { bgcolor: '#fff', transform: 'scale(1.2)' }
                }}
              />
            ))}
          </Box>
        )}
      </HeroContainer>
      
      {/* 2. 퀵 링크 섹션 */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 3, bgcolor: '#fff', border: '1px solid #eee' }}>
          <Grid container spacing={2} justifyContent="space-around" textAlign="center">
            {['머시닝센터', 'CNC선반', '범용밀링', '범용선반', '절단기/톱기계', '기타장비'].map((item) => (
              <Grid size={{ xs: 4, md: 2 }} key={item}>
                <Box 
                  sx={{ 
                    p: 2, borderRadius: 2, cursor: 'pointer', transition: '0.2s',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    '&:hover': { bgcolor: '#f5f5f5', transform: 'translateY(-5px)' } 
                  }}
                >
                  <Box sx={{ 
                    width: 60, height: 60, bgcolor: '#e8eaf6', borderRadius: '50%', 
                    mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    <ArrowForwardIcon color="primary" fontSize="large" />
                  </Box>
                  <Typography fontWeight="bold" variant="body1" color="text.primary">{item}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* 3. 추천 매물 섹션 */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Box component="span" sx={{ width: 5, height: 25, bgcolor: '#1A237E', mr: 2, borderRadius: 1 }} />
          오늘의 추천 매물
        </Typography>
        <Grid container spacing={3}>
          {RECOMMENDED_ITEMS.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                <Box sx={{ position: 'relative' }}>
                   <Chip 
                    label={item.status === 'SALE' ? '판매중' : '예약중'} 
                    color={item.status === 'SALE' ? 'primary' : 'warning'} 
                    size="small" 
                    sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }} 
                  />
                  <CardMedia component="img" height="200" image={item.img} alt={item.title} />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="body2" color="text.secondary">{item.year}</Typography>
                  <Typography variant="subtitle1" fontWeight="bold" component="div" sx={{ mb: 1, height: 50, overflow: 'hidden' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {item.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
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
    </Box>
  );
};

export default HomePage;