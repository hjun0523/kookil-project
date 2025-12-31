package com.kookil.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;

    // 1. 기본 정보
    @Column(nullable = false)
    private String title;          // 제목 (예: 두산 머시닝센터 5호기)

    @Column(unique = true)
    private Long productCode;      // 관리 번호 (예: 4513)

    private String manufacturer;   // 제조사 (예: 두산, 화천)
    private String modelName;      // 모델명
    private String modelYear;      // 연식 (예: 2015년)

    // 2. 스펙 및 상태
    @Column(length = 500)
    private String basicSpec;      // 기본 사양 (예: 테이블 2300-4000)

    private String usageStatus;    // 사용 여부 (예: 공장사용중)
    private String location;       // 보관 위치 (예: 경남 창원)

    // 3. 가격
    private Long price;            // 판매 금액
    private boolean isPriceOpen;   // 가격 공개 여부 (false면 '협의')

    @Enumerated(EnumType.STRING)
    private ItemStatus status;     // SALE, SOLD_OUT, RESERVED (기존 ItemStatus 재사용)

    // 4. 연관 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;     // 카테고리

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;    // 상세 설명

    // 5. 이미지 (1:N)
    @Builder.Default
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

    // 연관관계 편의 메소드
    public void addImage(ProductImage image) {
        this.images.add(image);
        image.setProduct(this);
    }
}