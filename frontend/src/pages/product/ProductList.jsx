import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Button, Drawer, 
  FormControl, Select, MenuItem, Pagination, Stack, Paper, CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid2'; 
import FilterListIcon from '@mui/icons-material/FilterList';
import ProductCard from '../../components/product/ProductCard';
import ProductFilter from '../../components/product/ProductFilter';
import ProductDetailDialog from '../../components/product/ProductDetailDialog'; 

import axiosClient from '../../api/axiosClient';

const ProductList = () => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sort, setSort] = useState('latest');
  
  // 👇 [수정] 데이터 상태 (전체 데이터를 클라에 다 받지 않음)
  const [products, setProducts] = useState([]); // 현재 페이지의 데이터만 저장
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0); // 전체 개수
  const [totalPages, setTotalPages] = useState(1);       // 전체 페이지 수

  // 👇 필터 및 페이지 상태
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12; // 한 페이지당 12개 (4열 x 3행)

  // 상세 팝업 상태
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // 1. 데이터 로드 (페이징 + 필터링 적용)
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedCategory]); 
  // page나 category가 바뀌면 API 재호출

  const fetchProducts = () => {
    setLoading(true);
    
    // API 요청 파라미터 구성
    // Spring Boot의 Pageable은 page가 0부터 시작하므로 (page - 1)
    let url = `/products?page=${page - 1}&size=${ITEMS_PER_PAGE}`;
    
    // 카테고리 필터가 있다면 파라미터 추가
    if (selectedCategory !== 'ALL') {
      url += `&categoryId=${selectedCategory}`;
    }

    axiosClient.get(url)
      .then((res) => {
        // 백엔드 Page<Dto> 응답 구조: { content: [], totalPages: 0, totalElements: 0, ... }
        console.log("매물 페이징 로드:", res);
        setProducts(res.content);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      })
      .catch((err) => {
        console.error("매물 목록 로드 실패:", err);
        alert("데이터를 불러오지 못했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 핸들러
  const handleDrawerToggle = () => setMobileFilterOpen(!mobileFilterOpen);
  
  const handleCategoryChange = (id) => {
    setSelectedCategory(id);
    setPage(1); // 카테고리 변경 시 1페이지로 초기화
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    // 스크롤을 맨 위로 올려주는 UX (선택사항)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleProductClick = (id) => {
    setSelectedProductId(id);
    setOpenDetail(true);
  };
  
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedProductId(null);
  };

  return (
    <Box sx={{ bgcolor: '#F4F6F8', minHeight: '100vh', pb: 8 }}>
      
      {/* 상단 헤더 영역 */}
      <Box sx={{ bgcolor: 'white', py: 3, borderBottom: '1px solid #eee', mb: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            전체 매물 리스트
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              총 <strong style={{ color: '#1A237E' }}>{totalElements}</strong>건의 매물이 있습니다.
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

      <Container maxWidth="xl"> {/* 너비를 좀 더 넓게 쓰기 위해 xl 사용 고려 가능, 일단 lg 유지 */}
        <Grid container spacing={3}>
          
          {/* 사이드바 필터 (PC) */}
          <Grid size={{ xs: 12, md: 3, lg: 2 }} sx={{ display: { xs: 'none', md: 'block' } }}> 
            {/* 필터 영역 너비를 조금 줄여서 리스트 영역 확보 (lg: 2) */}
            <Paper elevation={0} sx={{ p: 0, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <ProductFilter 
                selectedCategory={selectedCategory} 
                onCategoryChange={handleCategoryChange} 
              />
            </Paper>
          </Grid>

          {/* 매물 리스트 영역 */}
          <Grid size={{ xs: 12, md: 9, lg: 10 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={10}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {products.length === 0 ? (
                  <Box sx={{ py: 10, textAlign: 'center', bgcolor: 'white', borderRadius: 2 }}>
                    <Typography color="text.secondary">조건에 맞는 매물이 없습니다.</Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {products.map((item) => (
                      // 👇 [핵심] 한 줄에 4개 배치 (lg={3})
                      // xs=12 (1개), sm=6 (2개), md=4 (3개), lg=3 (4개)
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
                        <ProductCard item={item} onClick={() => handleProductClick(item.id)} />
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <Box display="flex" justifyContent="center" mt={6}>
                    <Pagination 
                      count={totalPages} 
                      page={page} 
                      onChange={handlePageChange} 
                      color="primary" 
                      shape="rounded" 
                      size="large"
                      showFirstButton 
                      showLastButton
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* 모바일 필터 드로어 */}
      <Drawer anchor="left" open={mobileFilterOpen} onClose={handleDrawerToggle} PaperProps={{ sx: { width: 280 } }}>
        <ProductFilter 
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange} 
          onClose={handleDrawerToggle} 
        />
      </Drawer>

      {/* 상세 정보 팝업 */}
      <ProductDetailDialog 
        open={openDetail} 
        productId={selectedProductId} 
        onClose={handleCloseDetail} 
      />
    </Box>
  );
};

export default ProductList;