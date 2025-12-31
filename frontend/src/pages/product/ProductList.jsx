import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Button, Drawer, 
  FormControl, Select, MenuItem, Pagination, Stack, Paper, CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid2'; // MUI v6
import FilterListIcon from '@mui/icons-material/FilterList';
import ProductCard from '../../components/product/ProductCard';
import ProductFilter from '../../components/product/ProductFilter';

// 👇 우리가 만든 API 클라이언트
import axiosClient from '../../api/axiosClient';

const ProductList = () => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sort, setSort] = useState('latest');
  
  // 👇 [1] 실제 데이터를 담을 상태 변수들
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDrawerToggle = () => {
    setMobileFilterOpen(!mobileFilterOpen);
  };

  // 👇 [2] 페이지가 열리면 백엔드에서 데이터 가져오기
  useEffect(() => {
    setLoading(true);
    axiosClient.get('/products') // '/api/products'로 요청됨 (Proxy)
      .then((res) => {
        console.log("매물 목록 로드 성공:", res);
        setProducts(res); // 받아온 리스트를 상태에 저장
      })
      .catch((err) => {
        console.error("매물 목록 로드 실패:", err);
        alert("데이터를 불러오지 못했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ bgcolor: '#F4F6F8', minHeight: '100vh', pb: 8 }}>
      <Box sx={{ bgcolor: 'white', py: 3, borderBottom: '1px solid #eee', mb: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            전체 매물 리스트
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              총 <strong style={{ color: '#1A237E' }}>{products.length}</strong>건의 매물이 있습니다.
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<FilterListIcon />} onClick={handleDrawerToggle} sx={{ display: { md: 'none' } }}>
                필터
              </Button>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select value={sort} onChange={(e) => setSort(e.target.value)} displayEmpty>
                  <MenuItem value="latest">최신순</MenuItem>
                  <MenuItem value="price_low">낮은가격순</MenuItem>
                  <MenuItem value="price_high">높은가격순</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          
          {/* 사이드바 필터 */}
          <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Paper elevation={0} sx={{ p: 0, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <ProductFilter />
            </Paper>
          </Grid>

          {/* 매물 리스트 영역 */}
          <Grid size={{ xs: 12, md: 9 }}>
            
            {/* 로딩 중일 때 스피너 표시 */}
            {loading ? (
              <Box display="flex" justifyContent="center" py={10}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {/* 👇 실제 데이터(products)로 반복문 실행 */}
                {products.map((item) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item.id}>
                    {/* 👇 DTO 필드명(title, price, imgUrl 등)이 ProductCard와 일치해야 함 */}
                    <ProductCard item={item} />
                  </Grid>
                ))}
              </Grid>
            )}

            <Box display="flex" justifyContent="center" mt={6}>
              <Pagination count={1} color="primary" shape="rounded" />
            </Box>
          </Grid>

        </Grid>
      </Container>

      <Drawer anchor="left" open={mobileFilterOpen} onClose={handleDrawerToggle} PaperProps={{ sx: { width: 280 } }}>
        <ProductFilter onClose={handleDrawerToggle} />
      </Drawer>
    </Box>
  );
};

export default ProductList;