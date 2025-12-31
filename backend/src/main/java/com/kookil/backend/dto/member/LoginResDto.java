package com.kookil.backend.dto.member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LoginResDto {
    private String grantType; // Bearer
    private String accessToken; // 실제 토큰
    private String role; // 권한 정보
}