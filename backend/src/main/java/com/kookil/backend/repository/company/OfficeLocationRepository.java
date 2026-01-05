package com.kookil.backend.repository.company;

import com.kookil.backend.entity.OfficeLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfficeLocationRepository extends JpaRepository<OfficeLocation, Long> {
    // 기본 CRUD 메서드 사용
}