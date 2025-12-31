package com.kookil.backend.service.member;

import com.kookil.backend.config.jwt.JwtTokenProvider;
import com.kookil.backend.dto.member.LoginReqDto;
import com.kookil.backend.dto.member.LoginResDto;
import com.kookil.backend.entity.Member;
import com.kookil.backend.repository.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public LoginResDto login(LoginReqDto request) {
        // 1. ID로 회원 조회
        Member member = memberRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new NoSuchElementException("아이디 또는 비밀번호가 올바르지 않습니다."));

        // 2. 비밀번호 검증 (암호화된 비번과 비교)
        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        // 3. 인증 성공 시 토큰 생성
        String accessToken = jwtTokenProvider.createToken(member.getUsername(), member.getRole());

        return LoginResDto.builder()
                .grantType("Bearer")
                .accessToken(accessToken)
                .role(member.getRole())
                .build();
    }
}