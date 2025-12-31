package com.kookil.backend.controller.member;

import com.kookil.backend.dto.member.LoginReqDto;
import com.kookil.backend.dto.member.LoginResDto;
import com.kookil.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // 로그인 API
    @PostMapping("/login")
    public LoginResDto login(@RequestBody LoginReqDto request) {
        return memberService.login(request);
    }
}