import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, 
  TextField, DialogActions, Switch, FormControlLabel, Select, MenuItem, FormControl, Chip, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import axiosClient from '../../../api/axiosClient';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [selectedType, setSelectedType] = useState('MAIN'); // MAIN or LOGO
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // 폼 데이터
  const [formData, setFormData] = useState({
    id: null,
    type: 'MAIN',
    title: '',
    imageUrl: '',
    linkUrl: '',
    orderIndex: 0,
    isVisible: true
  });
  
  // 파일 업로드용 상태
  const [uploadFile, setUploadFile] = useState(null);

  // 조회
  const fetchBanners = () => {
    axiosClient.get(`/banners?type=${selectedType}`)
      .then(res => setBanners(res))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBanners();
  }, [selectedType]);

  // 모달 열기
  const handleOpen = (banner = null) => {
    setUploadFile(null); // 파일 초기화
    if (banner) {
      setIsEdit(true);
      setFormData({
        id: banner.id,
        type: banner.type,
        title: banner.title,
        imageUrl: banner.imageUrl,
        linkUrl: banner.linkUrl || '',
        orderIndex: banner.orderIndex,
        isVisible: banner.isVisible 
      });
    } else {
      setIsEdit(false);
      setFormData({
        id: null,
        type: selectedType, // 현재 선택된 탭의 타입을 기본값으로
        title: '',
        imageUrl: '',
        linkUrl: '',
        orderIndex: banners.length + 1,
        isVisible: true
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  // 저장
  const handleSubmit = async () => {
    let finalImageUrl = formData.imageUrl;

    if (uploadFile) {
      const form = new FormData();
      form.append('file', uploadFile);
      try {
        const res = await axiosClient.post('/common/image', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalImageUrl = res;
      } catch (err) {
        alert('이미지 업로드 실패');
        return;
      }
    }

    if (!finalImageUrl) {
      alert("이미지를 등록해주세요.");
      return;
    }

    const payload = { 
      type: formData.type,
      title: formData.title,
      imageUrl: finalImageUrl,
      linkUrl: formData.linkUrl,
      orderIndex: formData.orderIndex,
      isVisible: formData.isVisible
    };

    try {
      if (isEdit) {
        await axiosClient.put(`/admin/banners/${formData.id}`, payload);
      } else {
        await axiosClient.post('/admin/banners', payload);
      }
      alert('저장되었습니다.');
      fetchBanners();
      handleClose();
    } catch (err) {
      console.error(err);
      alert('저장 실패');
    }
  };

  // 삭제
  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      axiosClient.delete(`/admin/banners/${id}`)
        .then(() => fetchBanners())
        .catch(err => alert('삭제 실패'));
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" fontWeight="bold">배너/로고 관리</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              sx={{ bgcolor: 'white' }}
            >
              <MenuItem value="MAIN">메인 배너</MenuItem>
              <MenuItem value="LOGO">사이트 로고</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ bgcolor: '#1A237E' }}>
          신규 등록
        </Button>
      </Box>
      
      {/* 팁 박스 추가 */}
      <Alert severity="info" sx={{ mb: 3 }} icon={<InfoIcon />}>
        {selectedType === 'MAIN' 
          ? "메인 배너 권장 사이즈: 1920px(너비) x 600px(높이) / JPG 권장"
          : "사이트 로고 권장 사이즈: 높이 60px (너비는 자유) / 배경 투명한 PNG 권장"
        }
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell align="center">순서</TableCell>
              <TableCell align="center">이미지</TableCell>
              <TableCell>제목/설명</TableCell>
              <TableCell>링크 URL</TableCell>
              <TableCell align="center">상태</TableCell>
              <TableCell align="center">관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banners.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell align="center">{item.orderIndex}</TableCell>
                <TableCell align="center">
                  <Box 
                    component="img" 
                    src={item.imageUrl} 
                    alt="preview" 
                    sx={{ 
                      height: 50, maxWidth: 120, objectFit: 'contain', // 👈 비율 유지하며 미리보기
                      border: '1px solid #ddd', borderRadius: 1, bgcolor: '#fff' 
                    }}
                  />
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.linkUrl || '-'}</TableCell>
                <TableCell align="center">
                   <Chip 
                    label={item.isVisible ? "노출중" : "숨김"} 
                    color={item.isVisible ? "primary" : "default"} 
                    size="small"
                    variant={item.isVisible ? "filled" : "outlined"}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpen(item)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(item.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
             {banners.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>등록된 이미지가 없습니다.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEdit ? '수정' : '등록'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            
            {/* 사이즈 가이드 안내 (모달 내부) */}
            <Typography variant="caption" color="text.secondary" sx={{ bgcolor: '#e3f2fd', p: 1, borderRadius: 1 }}>
              💡 팁: {formData.type === 'MAIN' ? '1920x600px 이미지를 권장합니다.' : '높이 60px 정도의 투명 PNG를 권장합니다.'}
            </Typography>

             {/* 이미지 미리보기 */}
            {(uploadFile || formData.imageUrl) && (
              <Box 
                sx={{ 
                  width: '100%', height: 200, bgcolor: '#f5f5f5', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  mb: 1, border: '1px dashed #ccc', borderRadius: 2, overflow: 'hidden'
                }}
              >
                {uploadFile ? (
                   <img src={URL.createObjectURL(uploadFile)} alt="new" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                ) : (
                   <img src={formData.imageUrl} alt="current" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                )}
              </Box>
            )}
            
            <Button variant="outlined" component="label" fullWidth>
              {isEdit ? '이미지 변경 (선택)' : '이미지 파일 업로드'}
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            
            {/* 타입 변경 기능 추가 (실수로 로고에 넣었을 때 바꿀 수 있게) */}
            <FormControl fullWidth>
               <Select
                size="small"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
               >
                 <MenuItem value="MAIN">메인 배너 (큰 이미지)</MenuItem>
                 <MenuItem value="LOGO">사이트 로고 (작은 이미지)</MenuItem>
               </Select>
            </FormControl>

            <TextField
              label="제목 (관리용)" fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              label="클릭 시 이동할 URL (선택)" fullWidth placeholder="/"
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
            />
            <TextField
              label="순서" type="number" fullWidth
              value={formData.orderIndex}
              onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
            />
            <FormControlLabel
              control={
                <Switch 
                  checked={formData.isVisible} 
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })} 
                />
              }
              label={formData.isVisible ? "사이트에 노출함" : "숨김 처리"}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">취소</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#1A237E' }}>
            {isEdit ? '수정 완료' : '등록 하기'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BannerManagement;