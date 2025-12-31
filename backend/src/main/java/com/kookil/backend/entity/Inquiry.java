package com.kookil.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "inquiry") // 고객 문의 테이블
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inquiry extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inquiry_id")
    private Long id;

    @Column(nullable = false, length = 50)
    private String customerName; // 고객명 (필수)

    @Column(nullable = false, length = 20)
    private String contact;      // 연락처 (필수)

    @Column(length = 100)
    private String modelName;    // 문의한 장비명 (선택, 상세페이지에서 문의 시 자동입력)

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;      // 문의 내용

    @Builder.Default
    private boolean isChecked = false; // 관리자 확인 여부 (읽음/안읽음)

    // 답변 완료 여부나 메모 등을 추가할 수도 있음
    @Column(length = 500)
    private String adminMemo;    // 관리자 비공개 메모 (예: 1/5일 통화 완료, 가격 협의중)
}