package com.kookil.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "member") // 관리자 테이블
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username; // 로그인 ID (예: admin, kookil_master)

    @Column(nullable = false)
    private String password; // 암호화된 비밀번호 (BCrypt 필수)

    @Column(nullable = false)
    private String name;     // 관리자 이름 (예: 관리자1)

    // 권한: 일단 "ROLE_ADMIN" 하나만 사용하겠지만, 확장성을 위해 남겨둠
    @Column(nullable = false)
    private String role;     // ROLE_ADMIN
}