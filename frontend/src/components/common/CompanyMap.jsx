import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { Box, Typography, Paper, Chip } from '@mui/material';
import Grid from '@mui/material/Grid2'; // Grid v2 사용
import PhoneIcon from '@mui/icons-material/Phone';

const CompanyMap = ({ locations }) => {
  // locations: [{ name: '인천 본사', ... }, { name: '창원 AS 센터', ... }]
  
  const [mapLoaded, setMapLoaded] = useState(false);

  // 카카오 스크립트 로드 여부 체크
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setMapLoaded(true);
    } else {
      console.error("카카오 지도 스크립트가 로드되지 않았습니다.");
    }
  }, []);

  if (!locations || locations.length === 0) {
    return <Box sx={{ p: 3, textAlign: 'center' }}>등록된 위치 정보가 없습니다.</Box>;
  }

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      
      {/* 탭 대신 Grid로 감싸서 모든 위치를 보여줌 */}
      <Grid container spacing={4}>
        {locations.map((loc, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            
            {/* 1. 각 지점 타이틀 (카드 헤더 느낌) */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label={loc.name} color="primary" sx={{ fontWeight: 'bold', bgcolor: '#1A237E' }} />
              <Typography variant="h6" fontWeight="bold" color="#333">
                {loc.name}
              </Typography>
            </Box>

            {/* 2. 지도 영역 */}
            {mapLoaded && (
              <Paper elevation={3} sx={{ p: 1, borderRadius: 2, overflow: 'hidden', mb: 3 }}>
                <Map
                  center={{ lat: loc.lat, lng: loc.lng }}
                  style={{ width: "100%", height: "400px", borderRadius: "8px" }}
                  level={3} // 확대 레벨
                  draggable={true} // 드래그 가능
                  zoomable={true} // 줌 가능
                >
                  <MapMarker position={{ lat: loc.lat, lng: loc.lng }}>
                    {/* 마커 위 정보창 */}
                    <div style={{ padding: "5px", color: "#000", textAlign: "center", minWidth: "150px" }}>
                      <div style={{ fontWeight: "bold", marginBottom: "3px" }}>{loc.name}</div>
                      <a 
                        href={`https://map.kakao.com/link/to/${loc.name},${loc.lat},${loc.lng}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ fontSize: "12px", color: "blue", textDecoration: "none" }}
                      >
                        큰 지도로 보기 / 길찾기
                      </a>
                    </div>
                  </MapMarker>
                </Map>
              </Paper>
            )}

            {/* 3. 하단 상세 정보 (주소, 전화번호) */}
            <Box sx={{ px: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                주소: {loc.address}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 1 }}>
                <PhoneIcon fontSize="small" />
                <Typography variant="body1">
                  {loc.phone}
                </Typography>
              </Box>

              {loc.description && (
                <Typography variant="body2" sx={{ mt: 1, color: '#666', bgcolor: '#f5f5f5', p: 1.5, borderRadius: 1 }}>
                  {loc.description}
                </Typography>
              )}
            </Box>

          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CompanyMap;