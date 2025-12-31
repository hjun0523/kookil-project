import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, List, ListItemButton, ListItemText, 
  Divider, Checkbox, FormControlLabel, FormGroup, Skeleton
} from '@mui/material';
import axiosClient from '../../api/axiosClient';

const ProductFilter = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 선택된 카테고리 관리 (기본값: 전체)
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // [1] 카테고리 목록 불러오기 (DB 연동)
  useEffect(() => {
    axiosClient.get('/categories')
      .then((res) => {
        // isVisible이 true인 카테고리만 필터링
        const visibleCats = res.filter(cat => cat.isVisible);
        setCategories(visibleCats);
      })
      .catch((err) => console.error("카테고리 로딩 실패:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryClick = (id) => {
    setSelectedCategory(id);
    // 모바일에서 필터 선택 시 드로어 닫기 (선택 사항)
    if (onClose) onClose(); 
    // TODO: 부모 컴포넌트(ProductList)에 필터링 요청 보내기 기능 추가 필요
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        카테고리
      </Typography>
      
      {/* 카테고리 리스트 */}
      <List component="nav" sx={{ mb: 3 }}>
        {/* 1. 전체 매물 (고정) */}
        <ListItemButton 
          selected={selectedCategory === 'ALL'}
          onClick={() => handleCategoryClick('ALL')}
          sx={{ borderRadius: 1, mb: 0.5, '&.Mui-selected': { bgcolor: '#e3f2fd', color: '#1A237E' } }}
        >
          <ListItemText primary="전체매물" primaryTypographyProps={{ fontWeight: 'medium' }} />
        </ListItemButton>

        {/* 2. DB에서 가져온 카테고리 (동적) */}
        {loading ? (
          // 로딩 중일 때 스켈레톤 UI
          [1, 2, 3, 4].map((i) => <Skeleton key={i} height={40} />)
        ) : (
          categories.map((cat) => (
            <ListItemButton 
              key={cat.id}
              selected={selectedCategory === cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              sx={{ borderRadius: 1, mb: 0.5, '&.Mui-selected': { bgcolor: '#e3f2fd', color: '#1A237E' } }}
            >
              <ListItemText primary={cat.name} />
            </ListItemButton>
          ))
        )}
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        상태
      </Typography>
      <FormGroup>
        <FormControlLabel control={<Checkbox defaultChecked />} label="판매중" />
        <FormControlLabel control={<Checkbox />} label="가격협의" />
        <FormControlLabel control={<Checkbox />} label="매각완료 제외" />
      </FormGroup>
    </Box>
  );
};

export default ProductFilter;