package com.kookil.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "office_locations")
public class OfficeLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // 지점명 (예: 인천 본사)
    private String address;     // 주소
    private String phone;       // 전화번호
    private Double lat;         // 위도
    private Double lng;         // 경도

    @Column(length = 500)
    private String description; // 설명
}