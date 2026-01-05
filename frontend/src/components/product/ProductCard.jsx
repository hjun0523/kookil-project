import React, { useState } from 'react';
import { 
  Card, CardMedia, CardContent, Typography, Box, Chip, Divider, IconButton 
} from '@mui/material';

// 아이콘 임포트
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ProductCard = ({ item, onClick }) => {
  // 1. 현재 보여줄 이미지 인덱스 관리
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // 이미지 리스트 안전하게 가져오기 (없으면 플레이스홀더 1장)
  const images = (item.images && item.images.length > 0) 
    ? item.images 
    : ["https://via.placeholder.com/300x200?text=No+Image"];

  // 2. 이미지 넘기기 핸들러 (이벤트 전파 방지 필수!)
  const handlePrev = (e) => {
    e.stopPropagation(); // 👈 부모(Card)의 onClick 이벤트가 실행되지 않도록 막음
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    e.stopPropagation(); // 👈 부모(Card)의 onClick 이벤트가 실행되지 않도록 막음
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  // 상태 뱃지 렌더링
  const getStatusChip = (status) => {
    switch (status) {
      case 'SALE': return <Chip label="판매중" color="primary" size="small" />;
      case 'HOLD': return <Chip label="예약중" color="warning" size="small" />;
      case 'SOLD_OUT': return <Chip label="매각완료" color="default" size="small" />;
      default: return <Chip label="판매중" color="primary" size="small" />;
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        transition: '0.3s', 
        cursor: 'pointer',
        position: 'relative', // 화살표 배치를 위해 relative
        // 호버 시 그림자 효과 & 화살표 보이기 처리
        '&:hover': { 
          transform: 'translateY(-5px)', 
          boxShadow: 6,
          '& .slider-arrow': { opacity: 1 } // slider-arrow 클래스를 가진 요소 보이게
        }
      }}
      onClick={onClick} // 카드 전체 클릭 시 상세 팝업 오픈
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        
        {/* (1) 상태 뱃지 (좌측 상단) */}
        <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
          {getStatusChip(item.status)}
        </Box>

        {/* (2) 이미지 영역 */}
        <CardMedia
          component="img"
          height="200"
          image={images[currentImgIndex]}
          alt={item.title}
          sx={{ objectFit: 'cover', bgcolor: '#f5f5f5', transition: '0.3s' }}
        />

        {/* (3) 이미지 슬라이더 컨트롤 (이미지가 2장 이상일 때만 표시) */}
        {images.length > 1 && (
          <>
            {/* 왼쪽 화살표 */}
            <IconButton
              className="slider-arrow" // 호버 효과를 위한 클래스명
              onClick={handlePrev}
              size="small"
              sx={{
                position: 'absolute',
                top: '50%',
                left: 5,
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                color: '#333',
                opacity: 0, // 평소엔 숨김
                transition: 'opacity 0.2s',
                zIndex: 3,
                '&:hover': { bgcolor: 'white' }
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            {/* 오른쪽 화살표 */}
            <IconButton
              className="slider-arrow"
              onClick={handleNext}
              size="small"
              sx={{
                position: 'absolute',
                top: '50%',
                right: 5,
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                color: '#333',
                opacity: 0, // 평소엔 숨김
                transition: 'opacity 0.2s',
                zIndex: 3,
                '&:hover': { bgcolor: 'white' }
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>

            {/* 페이지 인디케이터 (우측 하단 1/5) */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 4,
                fontSize: '0.75rem',
                fontWeight: 'bold',
                zIndex: 2
              }}
            >
              {currentImgIndex + 1} / {images.length}
            </Box>
          </>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* 카테고리 & 연식 */}
        <Typography variant="caption" color="text.secondary">
          {item.categoryName || '기타'} | {item.modelYear || '연식미상'}
        </Typography>

        {/* 제목 */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ 
            overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', 
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.3, height: '2.6em' 
        }}>
          {item.title}
        </Typography>

        <Divider sx={{ my: 1 }} />

        {/* 제조사 & 가격 */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
                {item.manufacturer}
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
                {item.isPriceOpen ? `${item.price.toLocaleString()}원` : '가격협의'}
            </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;