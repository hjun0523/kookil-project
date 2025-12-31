package com.kookil.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // 카테고리명 (예: 머시닝센터)

    private int orderIndex; // 정렬 순서

    @Builder.Default
    private boolean isVisible = true; // 노출 여부
}