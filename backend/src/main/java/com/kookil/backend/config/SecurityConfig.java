package com.kookil.backend.config;

import com.kookil.backend.config.jwt.JwtAuthenticationFilter;
import com.kookil.backend.config.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .httpBasic(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // [1] React 정적 리소스 (빌드된 파일들) 접근 허용 - ★ 이 부분이 핵심 추가됨
                        // index.html, assets 폴더 내 파일들, 파비콘, JSON 설정 파일 등은 로그인 없이 접근 가능해야 함
                        .requestMatchers("/", "/index.html", "/assets/**", "/static/**", "/*.ico", "/*.json", "/*.svg", "/vite.svg").permitAll()

                        // [2] 이미지 업로드 경로 접근 허용
                        .requestMatchers("/uploads/**").permitAll()

                        // [3] 공개 API (로그인 없이 사용 가능)
                        .requestMatchers(HttpMethod.GET, "/api/categories").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/menus").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/banners").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll() // 매물 상세/목록 조회
                        .requestMatchers(HttpMethod.POST, "/api/inquiries").permitAll()  // 문의하기
                        .requestMatchers("/api/members/login").permitAll()               // 로그인
                        .requestMatchers("/api/members/join").permitAll()                // 회원가입 (혹시 필요할 경우 대비)

                        // [4] 관리자 권한 필요
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

                        // [5] 그 외 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // CORS 설정: 로컬 개발 시 프론트엔드(5173)에서 오는 요청 허용
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 로컬 개발 환경의 프론트엔드 주소 허용
        config.setAllowedOrigins(List.of("http://localhost:5173"));

        // 허용할 HTTP 메소드
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 모든 헤더 허용
        config.setAllowedHeaders(List.of("*"));

        // 자격 증명(쿠키, 토큰 등) 허용
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}