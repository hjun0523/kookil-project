package com.kookil.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. 저장된 실제 경로를 가져온다 (절대 경로)
        // .toUri().toString()을 쓰면 "file:///Users/..." 형태로 안전하게 변환됨
        String uploadPath = Paths.get("./uploads").toAbsolutePath().toUri().toString();

        // 2. 브라우저에서 /uploads/** 로 요청하면 -> 실제 로컬 폴더로 연결
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
}