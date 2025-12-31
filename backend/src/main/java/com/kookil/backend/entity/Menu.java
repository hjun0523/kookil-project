package com.kookil.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "menu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Menu extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_id")
    private Long id;

    @Column(nullable = false)
    private String name;      // 메뉴명 (예: 전체매물)

    @Column(nullable = false)
    private String url;       // 이동 경로 (예: /product)

    private int orderIndex;   // 순서 (1, 2, 3...)

    @Builder.Default
    private boolean isVisible = true; // 노출 여부
}