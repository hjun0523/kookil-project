package com.kookil.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "banner")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Banner extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "banner_id")
    private Long id;

    @Column(nullable = false)
    private String type; // "MAIN" (메인배너) 또는 "LOGO" (로고)

    @Column(nullable = false)
    private String title; // 배너 제목 (관리용)

    @Column(nullable = false)
    private String imageUrl; // 이미지 경로 (/uploads/abc.jpg)

    private String linkUrl; // 클릭 시 이동할 주소 (선택)

    private int orderIndex; // 순서

    @Builder.Default
    private boolean isVisible = true; // 노출 여부
}