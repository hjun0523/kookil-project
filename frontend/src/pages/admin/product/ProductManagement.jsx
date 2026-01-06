import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, 
  TextField, DialogActions, Switch, FormControlLabel, Select, MenuItem, 
  InputLabel, FormControl, Chip, Grid 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CancelIcon from '@mui/icons-material/Cancel'; // 이미지 삭제 아이콘
import axiosClient from '../../../api/axiosClient';

const ProductManagement = () => {
  // 초기값을 빈 배열로 명시하여 초기 렌더링 에러 방지
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    id: null,
    categoryId: '',
    title: '',
    productCode: '', 
    manufacturer: '',
    modelName: '',
    modelYear: '',
    basicSpec: '',
    usageStatus: '공장사용중',
    location: '본사매장',
    price: 0,
    isPriceOpen: false,
    status: 'SALE',
    description: '',
    imageUrls: [] // 기존 이미지 + 업로드된 이미지 URL 목록
  });

  // 새로 업로드할 파일들 (임시 저장소)
  const [uploadFiles, setUploadFiles] = useState([]);

  // 1. 초기 데이터 로딩
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ★ [수정됨] 데이터 구조 안전하게 처리
  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get('/products');
      
      // 서버 응답 형태 확인 로직
      if (res && res.content && Array.isArray(res.content)) {
        // Case 1: 페이징 객체로 온 경우 ({ content: [...], pageable: ... })
        setProducts(res.content);
      } else if (Array.isArray(res)) {
        // Case 2: 그냥 배열로 온 경우 ([...])
        setProducts(res);
      } else {
        // Case 3: 데이터가 없거나 이상한 경우
        console.warn("데이터 형식이 배열이 아닙니다:", res);
        setProducts([]); 
      }
    } catch (err) {
      console.error("매물 목록 로드 실패:", err);
      setProducts([]); // 에러 발생 시 빈 배열로 초기화
    }
  };

  const fetchCategories = () => {
    axiosClient.get('/categories')
      .then(res => setCategories(res))
      .catch(err => console.error(err));
  };

  // 2. 모달 열기 (등록/수정 분기)
  const handleOpen = (product = null) => {
    setUploadFiles([]); // 업로드 파일 초기화
    
    if (product) {
      // 수정 모드: 기존 데이터 채워넣기
      setIsEdit(true);
      
      // 카테고리 이름을 ID로 매핑 (카테고리 삭제 후 매물만 남은 경우 대비)
      const matchedCategory = categories.find(c => c.name === product.categoryName);
      
      setFormData({
        id: product.id,
        categoryId: matchedCategory ? matchedCategory.id : (product.categoryId || ''),
        title: product.title,
        productCode: product.productCode || '',
        manufacturer: product.manufacturer || '',
        modelName: product.modelName || '',
        modelYear: product.modelYear || '',
        basicSpec: product.basicSpec || '',
        usageStatus: product.usageStatus || '',
        location: product.location || '',
        price: product.price || 0,
        isPriceOpen: product.isPriceOpen,
        status: product.status,
        description: product.description || '',
        imageUrls: product.images || [] // 기존 이미지 URL들
      });
    } else {
      // 등록 모드: 초기화
      setIsEdit(false);
      setFormData({
        id: null,
        categoryId: categories.length > 0 ? categories[0].id : '',
        title: '',
        productCode: '',
        manufacturer: '',
        modelName: '',
        modelYear: '',
        basicSpec: '',
        usageStatus: '공장사용중',
        location: '본사매장',
        price: 0,
        isPriceOpen: false,
        status: 'SALE',
        description: '',
        imageUrls: []
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // 3. 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 4. 파일 선택 핸들러
  const handleFileChange = (e) => {
    // 기존 파일들에 추가 (Array.from으로 변환)
    setUploadFiles([...uploadFiles, ...Array.from(e.target.files)]);
  };

  // 5. 이미지 삭제 핸들러 (미리보기에서 X 클릭 시)
  const handleRemoveExistingImage = (index) => {
    const newUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, imageUrls: newUrls });
  };

  const handleRemoveUploadFile = (index) => {
    const newFiles = uploadFiles.filter((_, i) => i !== index);
    setUploadFiles(newFiles);
  };

  // 6. 저장 (등록/수정)
  const handleSubmit = async () => {
    if (!formData.title || !formData.categoryId) {
      alert("장비명과 카테고리는 필수입니다.");
      return;
    }

    // (1) 새로 추가된 파일이 있다면 업로드 수행
    let newUploadedUrls = [];
    if (uploadFiles.length > 0) {
      for (const file of uploadFiles) {
        const form = new FormData();
        form.append('file', file);
        try {
          const res = await axiosClient.post('/common/image', form, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          newUploadedUrls.push(res); 
        } catch (err) {
          console.error("이미지 업로드 실패", err);
          alert("일부 이미지 업로드에 실패했습니다.");
        }
      }
    }

    // (2) 최종 이미지 리스트 = (기존 유지된 이미지) + (새로 업로드된 이미지)
    const finalImageUrls = [...formData.imageUrls, ...newUploadedUrls];

    // (3) 전송할 데이터 구성
    const payload = {
      ...formData,
      imageUrls: finalImageUrls,
      price: parseInt(formData.price) || 0,
      productCode: formData.productCode ? parseInt(formData.productCode) : null
    };

    try {
      if (isEdit) {
        // 수정 (PUT)
        await axiosClient.put(`/admin/products/${formData.id}`, payload);
        alert("성공적으로 수정되었습니다.");
      } else {
        // 등록 (POST)
        await axiosClient.post('/admin/products', payload);
        alert("매물이 등록되었습니다.");
      }
      fetchProducts();
      handleClose();
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 7. 삭제
  const handleDelete = (id) => {
    if (window.confirm("정말 삭제하시겠습니까? 복구할 수 없습니다.")) {
      axiosClient.delete(`/admin/products/${id}`)
        .then(() => {
          alert("삭제되었습니다.");
          fetchProducts();
        })
        .catch(err => alert("삭제 실패"));
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">매물 관리</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ bgcolor: '#1A237E' }}>
          매물 등록
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">사진</TableCell>
              <TableCell>장비명 / 스펙</TableCell>
              <TableCell>카테고리</TableCell>
              <TableCell>금액</TableCell>
              <TableCell align="center">상태</TableCell>
              <TableCell align="center">관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* ★ [수정됨] products가 배열이고 데이터가 있을 때만 map 실행 */}
            {Array.isArray(products) && products.length > 0 ? (
              products.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell align="center">{item.productCode || item.id}</TableCell>
                  <TableCell align="center">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt="thumb" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                    ) : (
                      <Box sx={{ width: 50, height: 50, bgcolor: '#eee', borderRadius: 4 }} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">{item.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.manufacturer} | {item.modelYear}</Typography>
                  </TableCell>
                  <TableCell>{item.categoryName}</TableCell>
                  <TableCell>
                    {item.isPriceOpen ? item.price.toLocaleString() + '원' : '협의'}
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={item.status === 'SALE' ? '판매중' : item.status === 'SOLD_OUT' ? '매각완료' : '예약중'} 
                      color={item.status === 'SALE' ? 'primary' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleOpen(item)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(item.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // 데이터가 없을 경우 표시
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <Typography variant="body1" color="text.secondary">
                    등록된 매물이 없습니다.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 등록/수정 모달 */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{isEdit ? '매물 수정' : '매물 등록'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* 1. 카테고리 & 기본정보 */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>카테고리</InputLabel>
                <Select name="categoryId" value={formData.categoryId} label="카테고리" onChange={handleChange}>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField fullWidth margin="normal" label="장비명 (제목)" name="title" value={formData.title} onChange={handleChange} />
            </Grid>

            <Grid item xs={6} sm={4}>
              <TextField fullWidth margin="normal" label="제조사" name="manufacturer" value={formData.manufacturer} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField fullWidth margin="normal" label="모델명" name="modelName" value={formData.modelName} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField fullWidth margin="normal" label="연식 (예: 2018년)" name="modelYear" value={formData.modelYear} onChange={handleChange} />
            </Grid>

            {/* 2. 스펙 & 상태 */}
            <Grid item xs={12}>
              <TextField fullWidth margin="normal" label="기본 사양 (예: 테이블 1000x500)" name="basicSpec" value={formData.basicSpec} onChange={handleChange} />
            </Grid>
            
            <Grid item xs={6} sm={4}>
              <TextField fullWidth margin="normal" label="사용 여부" name="usageStatus" value={formData.usageStatus} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField fullWidth margin="normal" label="보관 위치" name="location" value={formData.location} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>판매 상태</InputLabel>
                <Select name="status" value={formData.status} label="판매 상태" onChange={handleChange}>
                  <MenuItem value="SALE">판매중</MenuItem>
                  <MenuItem value="HOLD">예약중/상담중</MenuItem>
                  <MenuItem value="SOLD_OUT">매각완료</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* 3. 가격 */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth margin="normal" type="number" label="판매 금액 (원)" name="price" value={formData.price} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="center">
              <FormControlLabel
                control={<Switch checked={formData.isPriceOpen} onChange={(e) => setFormData({...formData, isPriceOpen: e.target.checked})} />}
                label="가격 공개 (체크 해제 시 '협의')"
              />
            </Grid>

            {/* 4. 이미지 업로드 & 관리 */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>장비 사진</Typography>
              
              <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
                사진 추가
                <input hidden accept="image/*" multiple type="file" onChange={handleFileChange} />
              </Button>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {/* (1) 기존 이미지들 */}
                {formData.imageUrls.map((url, idx) => (
                  <Box key={`old-${idx}`} sx={{ position: 'relative', width: 100, height: 100 }}>
                    <img src={url} alt="existing" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }} />
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveExistingImage(idx)}
                      sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'white', '&:hover': { bgcolor: '#f5f5f5' } }}
                    >
                      <CancelIcon color="error" />
                    </IconButton>
                  </Box>
                ))}

                {/* (2) 새로 추가할 이미지들 (미리보기) */}
                {uploadFiles.map((file, idx) => (
                   <Box key={`new-${idx}`} sx={{ position: 'relative', width: 100, height: 100 }}>
                    <img src={URL.createObjectURL(file)} alt="new" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4, border: '2px solid #1A237E' }} />
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveUploadFile(idx)}
                      sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'white', '&:hover': { bgcolor: '#f5f5f5' } }}
                    >
                      <CancelIcon color="error" />
                    </IconButton>
                    <Typography variant="caption" sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', bgcolor: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '10px', textAlign: 'center' }}>NEW</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* 5. 상세 설명 */}
            <Grid item xs={12}>
              <TextField
                fullWidth margin="normal" multiline rows={4}
                label="상세 설명" name="description"
                value={formData.description} onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#1A237E' }}>
            {isEdit ? '수정 완료' : '등록 하기'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;