import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Divider, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CompanyMap from '../../components/common/CompanyMap'; // 지도 컴포넌트 임포트
import axiosClient from '../../api/axiosClient'; // API 클라이언트 임포트

const CompanyIntro = () => {
  // 상태 관리
  const [locations, setLocations] = useState([]); // 위치 데이터 저장
  const [loading, setLoading] = useState(true);   // 로딩 상태

  // 1. 페이지 로드 시 백엔드에서 위치 데이터 가져오기
  useEffect(() => {
    axiosClient.get('/company/locations')
      .then(res => {
        // 데이터가 성공적으로 오면 상태 업데이트
        setLocations(res);
      })
      .catch(err => {
        console.error("위치 정보 로드 실패:", err);
      })
      .finally(() => {
        // 성공하든 실패하든 로딩 종료
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      
      {/* 1. 상단 타이틀 섹션 */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
          (주)국일기계
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}>
          30년 전통의 공작기계 전문 기업, 고객의 성공과 함께합니다.<br/>
          최고의 품질과 확실한 AS로 보답하겠습니다.
        </Typography>
        <Divider sx={{ my: 4, width: '100px', mx: 'auto', bgcolor: '#1A237E', height: '3px' }} />
      </Box>

      {/* 2. 회사 개요 (디자인 요소) */}
      <Grid container spacing={4} sx={{ mb: 10 }}>
        <Grid size={{ xs: 12, md: 6 }}>
           <Paper elevation={0} sx={{ p: 4, bgcolor: '#f5f5f5', height: '100%', borderRadius: 3 }}>
             <Typography variant="h5" fontWeight="bold" gutterBottom color="#333"> 
               경영 이념 
             </Typography>
             <Divider sx={{ mb: 2, width: '40px', bgcolor: '#333' }} />
             <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#555' }}>
               투명한 거래, 신속한 서비스, 고객 감동 실현을 목표로 <br/>
               대한민국 기계 산업의 발전에 이바지하고 있습니다.
             </Typography>
           </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
           <Paper elevation={0} sx={{ p: 4, bgcolor: '#e8eaf6', height: '100%', borderRadius: 3 }}>
             <Typography variant="h5" fontWeight="bold" gutterBottom color="#1A237E"> 
               주요 사업 
             </Typography>
             <Divider sx={{ mb: 2, width: '40px', bgcolor: '#1A237E' }} />
             <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#555' }}>
               ✔ 중고 공작기계 매입 및 매각 <br/>
               ✔ 기계 수리 및 오버홀 (전문 A/S 센터 운영) <br/>
               ✔ 공장 설비 컨설팅 및 일괄 매각 진행
             </Typography>
           </Paper>
        </Grid>
      </Grid>

      {/* 3. 오시는 길 (지도 섹션) */}
      <Box id="location-section">
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ mb: 4 }}>
          오시는 길
        </Typography>

        {/* 로딩 중일 때는 스피너 표시, 로딩 끝나면 지도 표시 */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', bgcolor: '#f9f9f9', borderRadius: 2 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <CompanyMap locations={locations} />
        )}
      </Box>

    </Container>
  );
};

export default CompanyIntro;