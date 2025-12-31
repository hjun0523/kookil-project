import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, IconButton, 
  Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  Switch, FormControlLabel, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axiosClient from '../../../api/axiosClient';

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    url: '',
    orderIndex: 0,
    isVisible: true
  });

  // 목록 불러오기
  const fetchMenus = () => {
    axiosClient.get('/menus')
      .then(res => {
        setMenus(res);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // 모달 열기
  const handleOpen = (menu = null) => {
    if (menu) {
      setIsEdit(true);
      setFormData({ 
        id: menu.id,
        name: menu.name,
        url: menu.url,
        orderIndex: menu.orderIndex,
        isVisible: menu.isVisible // 백엔드에서 받은 값 그대로 세팅
      });
    } else {
      setIsEdit(false);
      // 신규 등록 시 기본값
      setFormData({ 
        id: null, 
        name: '', 
        url: '/', 
        orderIndex: menus.length + 1, 
        isVisible: true 
      });
    }
    setOpen(true);
  };

  // 모달 닫기
  const handleClose = () => setOpen(false);

  // 저장 (등록/수정)
  const handleSubmit = () => {
    // 유효성 검사 간단 체크
    if (!formData.name || !formData.url) {
      alert("메뉴명과 URL은 필수입니다.");
      return;
    }

    if (isEdit) {
      // 수정 (PUT)
      axiosClient.put(`/admin/menus/${formData.id}`, formData)
        .then(() => {
          alert('성공적으로 수정되었습니다.');
          fetchMenus();
          handleClose();
        })
        .catch(err => {
          console.error(err);
          alert('수정에 실패했습니다.');
        });
    } else {
      // 등록 (POST)
      axiosClient.post('/admin/menus', formData)
        .then(() => {
          alert('성공적으로 등록되었습니다.');
          fetchMenus();
          handleClose();
        })
        .catch(err => {
          console.error(err);
          alert('등록에 실패했습니다.');
        });
    }
  };

  // 삭제
  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까? 해당 메뉴가 홈페이지에서 즉시 사라집니다.')) {
      axiosClient.delete(`/admin/menus/${id}`)
        .then(() => {
          alert('삭제되었습니다.');
          fetchMenus();
        })
        .catch(err => alert('삭제 실패'));
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">메뉴 관리</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ bgcolor: '#1A237E' }}>
          메뉴 추가
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell align="center" width="10%">순서</TableCell>
              <TableCell width="30%">메뉴명</TableCell>
              <TableCell width="30%">URL 경로</TableCell>
              <TableCell align="center" width="15%">상태</TableCell>
              <TableCell align="center" width="15%">관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menus.map((menu) => (
              <TableRow key={menu.id} hover>
                <TableCell align="center">{menu.orderIndex}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{menu.name}</TableCell>
                <TableCell>{menu.url}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={menu.isVisible ? "노출중" : "숨김"} 
                    color={menu.isVisible ? "primary" : "default"} 
                    size="small"
                    variant={menu.isVisible ? "filled" : "outlined"}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpen(menu)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(menu.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {menus.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  등록된 메뉴가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 등록/수정 다이얼로그 */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {isEdit ? '메뉴 수정' : '메뉴 등록'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal" label="메뉴명" fullWidth 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              helperText="예: 전체매물, 회사소개"
            />
            <TextField
              margin="normal" label="URL 경로" fullWidth 
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              helperText="예: /product, /about"
            />
            <TextField
              margin="normal" label="표시 순서 (숫자)" type="number" fullWidth 
              value={formData.orderIndex}
              onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
            />
            <FormControlLabel
              control={
                <Switch 
                  checked={formData.isVisible} 
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  color="primary"
                />
              }
              label={formData.isVisible ? "사이트에 노출함" : "숨김 처리 (임시 저장)"}
              sx={{ mt: 2, display: 'block' }}
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

export default MenuManagement;