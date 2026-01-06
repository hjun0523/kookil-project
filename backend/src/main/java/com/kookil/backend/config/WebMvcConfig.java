package com.kookil.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    // application.yml(또는 local/prod)에서 'upload.path' 값을 가져옴
    // 값이 없으면 기본값으로 './uploads/' 사용
    @Value("${upload.path:./uploads/}")
    private String uploadPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. 가져온 경로가 "file:" 로 시작하지 않으면 붙여줌 (리눅스/윈도우 호환)
        String resourceLocation = uploadPath;
        if (!resourceLocation.startsWith("file:")) {
            resourceLocation = "file:" + resourceLocation;
        }

        // 2. 브라우저 접근 경로 설정
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resourceLocation);
    }
}