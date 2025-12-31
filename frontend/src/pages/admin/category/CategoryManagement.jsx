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

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    orderIndex: 0,
    isVisible: true
  });

  const fetchCategories = () => {
    axiosClient.get('/categories')
      .then(res => setCategories(res))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpen = (category = null) => {
    if (category) {
      setIsEdit(true);
      setFormData({ 
        id: category.id, 
        name: category.name, 
        orderIndex: category.orderIndex, 
        isVisible: category.isVisible 
      });
    } else {
      setIsEdit(false);
      setFormData({ 
        id: null, 
        name: '', 
        orderIndex: categories.length + 1, 
        isVisible: true 
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    if (!formData.name) {
      alert("카테고리명은 필수입니다.");
      return;
    }

    if (isEdit) {
      axiosClient.put(`/admin/categories/${formData.id}`, formData)
        .then(() => {
          alert('수정되었습니다.');
          fetchCategories();
          handleClose();
        })
        .catch(err => alert('수정 실패'));
    } else {
      axiosClient.post('/admin/categories', formData)
        .then(() => {
          alert('등록되었습니다.');
          fetchCategories();
          handleClose();
        })
        .catch(err => alert('등록 실패'));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('삭제하시겠습니까? 이 카테고리에 속한 매물이 있으면 문제가 될 수 있습니다.')) {
      axiosClient.delete(`/admin/categories/${id}`)
        .then(() => {
          alert('삭제되었습니다.');
          fetchCategories();
        })
        .catch(err => alert('삭제 실패'));
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">카테고리 관리</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ bgcolor: '#1A237E' }}>
          신규 등록
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell align="center" width="10%">순서</TableCell>
              <TableCell>카테고리명</TableCell>
              <TableCell align="center" width="15%">상태</TableCell>
              <TableCell align="center" width="15%">관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell align="center">{item.orderIndex}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{item.name}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={item.isVisible ? "사용중" : "숨김"} 
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
             {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 5 }}>등록된 카테고리가 없습니다.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>{isEdit ? '카테고리 수정' : '카테고리 등록'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal" label="카테고리명" fullWidth autoFocus
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="normal" label="순서" type="number" fullWidth
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
            label="사용 여부"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#1A237E' }}>저장</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;