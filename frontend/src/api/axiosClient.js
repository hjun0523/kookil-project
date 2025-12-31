import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api', // Vite Proxy를 통해 백엔드(8080)로 전달
  headers: {
    'Content-Type': 'application/json',
  },
});

// 👇 [추가] 요청 인터셉터: API 요청 보낼 때마다 토큰이 있으면 헤더에 쏙! 넣음
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

// 👇 [추가] 응답 인터셉터: 401(권한 없음) 에러가 뜨면 강제 로그아웃 처리
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // data만 바로 반환
  },
  (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      // 토큰이 만료되었거나 위조된 경우 -> 로그아웃 시키고 로그인 페이지로 보냄
      localStorage.removeItem('ACCESS_TOKEN');
      // window.location.href = '/k-manager/login'; // 필요 시 주석 해제
    }
    throw error;
  }
);

export default axiosClient;