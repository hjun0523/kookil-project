import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 개발 서버 설정
    proxy: {
      // '/api'로 시작하는 요청은 백엔드 서버(8080)로 전달
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // 2. 👇 [추가] 이미지 요청(/uploads)도 백엔드로 연결
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    // 빌드 시 결과물이 생성될 경로 (나중에 Spring Boot의 static 폴더로 자동 복사되게 세팅할 때 사용)
    outDir: '../backend/src/main/resources/static', 
    emptyOutDir: true, // 빌드 시 기존 파일 삭제
  }
})