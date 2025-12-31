package com.kookil.backend.config;

import jakarta.servlet.MultipartConfigElement;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;

@Configuration
public class UploadConfig {

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();

        // 파일 하나의 최대 크기: 50MB로 설정 (기본 1MB)
        factory.setMaxFileSize(DataSize.ofMegabytes(50));

        // 요청 전체의 최대 크기: 50MB로 설정 (기본 10MB)
        factory.setMaxRequestSize(DataSize.ofMegabytes(50));

        return factory.createMultipartConfig();
    }
}