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
                        // [1] 정적 리소스 및 SPA 라우팅 경로 허용
                        .requestMatchers("/", "/index.html", "/assets/**", "/static/**", "/*.ico", "/*.json", "/*.svg", "/vite.svg").permitAll()

                        // ★ [수정] 관리자 페이지 라우팅 경로 허용
                        .requestMatchers("/k-manager/**").permitAll()

                        // [2] 이미지 업로드 경로 접근 허용
                        .requestMatchers("/uploads/**").permitAll()

                        // [3] 공개 API
                        .requestMatchers(HttpMethod.GET, "/api/categories", "/api/menus", "/api/banners").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/inquiries").permitAll()
                        .requestMatchers("/api/members/login", "/api/members/join").permitAll()

                        // 👇 [추가] 회사 소개(위치 정보 등) API 허용 (403 에러 해결)
                        .requestMatchers(HttpMethod.GET, "/api/company/**").permitAll()

                        // [4] 관리자 권한 API
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

                        // [5] 나머지 인증 필요
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // ★ [수정] AWS 서버 IP와 로컬 모두 허용
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://3.37.212.116:8080",
                "http://3.37.212.116"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}