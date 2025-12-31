package com.kookil.backend.dto.member;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginReqDto {
    private String username;
    private String password;
}