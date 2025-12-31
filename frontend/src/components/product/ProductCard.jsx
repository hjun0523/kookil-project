import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ item }) => {
  const navigate = useNavigate();

  // [1] 이미지 처리: 배열의 첫 번째 이미지를 사용하고, 없으면 기본 이미지 표시
  // 백엔드에서 item.images = ["/uploads/...", "/uploads/..."] 형태로 옴
  const thumbnailUrl = (item.images && item.images.length > 0) 
    ? item.images[0] 
    : "https://via.placeholder.com/300x200?text=No+Image"; 

  // [2] 상태 뱃지 설정
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
        height: '100%', display: 'flex', flexDirection: 'column', 
        transition: '0.3s', cursor: 'pointer',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
      }}
      onClick={() => navigate(`/product/${item.id}`)}
    >
      <Box sx={{ position: 'relative' }}>
        {/* 상태 뱃지 (이미지 위에 띄움) */}
        <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
          {getStatusChip(item.status)}
        </Box>

        {/* [중요] 이미지 렌더링 */}
        <CardMedia
          component="img"
          height="200"
          image={thumbnailUrl} // 👈 수정된 이미지 URL 사용
          alt={item.title}
          sx={{ objectFit: 'cover', bgcolor: '#f5f5f5' }}
        />
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

        {/* 제조사 & 모델명 */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
                {item.manufacturer}
            </Typography>
            {/* 가격 표시 로직 (공개 여부에 따라) */}
            <Typography variant="h6" color="primary" fontWeight="bold">
                {item.isPriceOpen ? `${item.price.toLocaleString()}원` : '가격협의'}
            </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;