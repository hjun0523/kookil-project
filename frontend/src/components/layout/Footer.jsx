// src/components/layout/Footer.jsx
import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#263238', color: 'white', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              (주)국일기계
            </Typography>
            <Typography variant="body2" sx={{ color: '#cfd8dc' }}>
              인천광역시 서구 백범로 776번지<br />
              대표전화: 1599-1539 | 팩스: 032-123-4567<br />
              이메일: kookilmc@hanmail.net
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
             <Typography variant="body2" sx={{ color: '#cfd8dc' }}>
               Copyright(c) 2001 (주)국일기계 All right reserved.
             </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;