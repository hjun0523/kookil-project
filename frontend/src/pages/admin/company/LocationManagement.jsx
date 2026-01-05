import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, TextField, Button, Grid, Divider, Alert 
} from '@mui/material';
import DaumPostcodeEmbed from 'react-daum-postcode';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axiosClient from '../../../api/axiosClient'; // API 클라이언트

const LocationManagement = () => {
  // 초기 상태
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 주소 검색 팝업 관련 상태
  const [openPostcode, setOpenPostcode] = useState(false);
  const [targetIndex, setTargetIndex] = useState(null); // 수정 중인 항목의 인덱스

  // 1. 데이터 불러오기 (Read)
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axiosClient.get('/company/locations');
      
      // DB에 데이터가 없으면 기본 폼 2개(본사, 지사) 생성
      if (!res || res.length === 0) {
        setLocations([
          { name: '본사 (설정 필요)', address: '', phone: '', lat: 37.5665, lng: 126.9780, description: '' },
          { name: '지사 (설정 필요)', address: '', phone: '', lat: 35.1795, lng: 129.0756, description: '' }
        ]);
      } else {
        setLocations(res);
      }
    } catch (err) {
      console.error("위치 정보 로딩 실패:", err);
      // 에러 발생 시에도 빈 폼은 보여줌
      setLocations([
        { name: '본사 (설정 필요)', address: '', phone: '', lat: 37.5665, lng: 126.9780, description: '' },
        { name: '지사 (설정 필요)', address: '', phone: '', lat: 35.1795, lng: 129.0756, description: '' }
      ]);
    }
  };

  // 2. 입력값 변경 핸들러
  const handleChange = (index, field, value) => {
    const newLocations = [...locations];
    newLocations[index][field] = value;
    setLocations(newLocations);
  };

  // 3. 주소 검색 팝업 열기
  const handleOpenPostcode = (index) => {
    setTargetIndex(index);
    setOpenPostcode(true);
  };

  // 4. [핵심] 주소 선택 완료 & 좌표 변환
  const handleCompletePostcode = (data) => {
    const fullAddress = data.address; // 선택한 도로명 주소
    const newLocations = [...locations];
    
    // 주소 텍스트 업데이트
    newLocations[targetIndex].address = fullAddress;

    // 카카오 Geocoder를 사용해 주소 -> 좌표 변환
    if (window.kakao && window.kakao.maps) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      
      geocoder.addressSearch(fullAddress, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const lat = parseFloat(result[0].y); // 위도
          const lng = parseFloat(result[0].x); // 경도
          
          newLocations[targetIndex].lat = lat;
          newLocations[targetIndex].lng = lng;
          
          setLocations(newLocations);
          console.log(`좌표 변환 성공: ${lat}, ${lng}`);
        } else {
          alert('해당 주소의 좌표를 찾을 수 없습니다.');
        }
      });
    } else {
      alert('카카오 지도 스크립트가 로드되지 않아 좌표 변환에 실패했습니다.');
    }

    setOpenPostcode(false); // 팝업 닫기
  };

  // 5. 저장하기 (Update)
  const handleSave = async () => {
    if (!window.confirm('위치 정보를 수정하시겠습니까?')) return;
    
    setLoading(true);
    try {
      // 백엔드 API 호출 (일괄 저장)
      await axiosClient.put('/admin/company/locations', locations);
      
      alert('성공적으로 저장되었습니다.');
      fetchLocations(); // 최신 데이터 다시 로드
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        회사 위치 관리 (오시는 길)
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        [주소 검색]을 이용하면 지도 좌표(위도, 경도)가 자동으로 입력됩니다.
      </Alert>

      <Grid container spacing={3}>
        {locations.map((loc, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                #{index + 1} {index === 0 ? '본사' : '지사/센터'} 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* 지점 명칭 */}
              <TextField
                label="지점 명칭 (예: 인천 본사)"
                fullWidth
                margin="normal"
                value={loc.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />

              {/* 주소 및 검색 버튼 */}
              <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 1 }}>
                <TextField
                  label="주소"
                  fullWidth
                  value={loc.address}
                  InputProps={{ readOnly: true }} // 직접 수정 불가
                  placeholder="주소 검색 버튼을 눌러주세요"
                />
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={() => handleOpenPostcode(index)}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  주소 검색
                </Button>
              </Box>

              {/* 좌표 (자동 입력됨) */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField 
                  label="위도 (Lat)" size="small" fullWidth disabled 
                  value={loc.lat || 0} 
                />
                <TextField 
                  label="경도 (Lng)" size="small" fullWidth disabled 
                  value={loc.lng || 0} 
                />
              </Box>

              {/* 전화번호 */}
              <TextField
                label="대표 전화번호"
                fullWidth
                margin="normal"
                value={loc.phone}
                onChange={(e) => handleChange(index, 'phone', e.target.value)}
              />

              {/* 설명 */}
              <TextField
                label="설명/안내 문구"
                fullWidth
                multiline
                rows={3}
                margin="normal"
                value={loc.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'right' }}>
        <Button 
          variant="contained" 
          size="large" 
          onClick={handleSave}
          disabled={loading}
          sx={{ px: 5, py: 1.5, fontSize: '1.1rem', bgcolor: '#1A237E' }}
        >
          {loading ? '저장 중...' : '전체 저장하기'}
        </Button>
      </Box>

      {/* 다음 주소 검색 팝업 */}
      <Dialog open={openPostcode} onClose={() => setOpenPostcode(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          주소 검색
          <IconButton onClick={() => setOpenPostcode(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ width: '500px', height: '500px', p: 0 }}>
          <DaumPostcodeEmbed onComplete={handleCompletePostcode} autoClose={false} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LocationManagement;