import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, List, ListItemButton, ListItemText, 
  Divider, Checkbox, FormControlLabel, FormGroup, Skeleton
} from '@mui/material';
import axiosClient from '../../api/axiosClient';

// props로 selectedCategory와 onChange 핸들러를 받음
const ProductFilter = ({ selectedCategory, onCategoryChange, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
   
  // 카테고리 로딩
  useEffect(() => {
    axiosClient.get('/categories')
      .then((res) => {
        const visibleCats = res.filter(cat => cat.isVisible).sort((a,b) => a.orderIndex - b.orderIndex);
        setCategories(visibleCats);
      })
      .catch((err) => console.error("카테고리 로딩 실패:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryClick = (id) => {
    onCategoryChange(id); // 👈 부모 컴포넌트의 함수 호출
    if (onClose) onClose(); 
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        카테고리
      </Typography>
      
      <List component="nav" sx={{ mb: 3 }}>
        {/* 전체 매물 */}
        <ListItemButton 
          selected={selectedCategory === 'ALL'}
          onClick={() => handleCategoryClick('ALL')}
          sx={{ borderRadius: 1, mb: 0.5, '&.Mui-selected': { bgcolor: '#e3f2fd', color: '#1A237E' } }}
        >
          <ListItemText primary="전체매물" primaryTypographyProps={{ fontWeight: 'medium' }} />
        </ListItemButton>

        {/* 동적 카테고리 */}
        {loading ? (
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
        상태 필터 (준비중)
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