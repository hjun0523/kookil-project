package com.kookil.backend.repository.member;

import com.kookil.backend.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    // 로그인 시 아이디로 회원 찾기
    Optional<Member> findByUsername(String username);
}