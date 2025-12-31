package com.kookil.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String test() {
        return "안녕하세요! 백엔드 서버가 정상 작동 중입니다. (Spring Boot)";
    }
}