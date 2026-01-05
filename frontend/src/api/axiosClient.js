import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api', // Vite Proxy를 통해 백엔드(8080)로 전달
  headers: {
    'Content-Type': 'application/json',
  },
});

// 👇 [요청 인터셉터] API 요청 보낼 때마다 토큰이 있으면 헤더에 넣음
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 👇 [응답 인터셉터] 401(권한 없음/토큰 만료) 에러 처리 강화
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // 성공 시 data만 반환
  },
  (error) => {
    const { response } = error;
    
    // 서버에서 401 (Unauthorized) 응답이 왔을 때 (토큰 만료 등)
    if (response && response.status === 401) {
      // 1. 만료된 토큰 삭제
      localStorage.removeItem('ACCESS_TOKEN');
      
      // 2. (선택사항) 사용자 정보 등 관련 데이터가 있다면 함께 삭제
      // localStorage.removeItem('USER_INFO'); 

      // 3. 사용자에게 알림 (UX 개선)
      alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');

      // 4. 로그인 페이지로 강제 이동 (주석 해제 및 적용)
      window.location.href = '/k-manager/login'; 
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;