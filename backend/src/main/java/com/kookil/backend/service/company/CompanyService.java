package com.kookil.backend.service.company;

import com.kookil.backend.entity.OfficeLocation;
import com.kookil.backend.repository.company.OfficeLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final OfficeLocationRepository locationRepository;

    // 1. 조회 (사용자/관리자 공용)
    @Transactional(readOnly = true)
    public List<OfficeLocation> getAllLocations() {
        return locationRepository.findAll();
    }

    // 2. 일괄 저장 (관리자용)
    // ID가 있으면 수정(Update), 없으면 생성(Insert)
    @Transactional
    public List<OfficeLocation> saveAllLocations(List<OfficeLocation> locations) {
        // 기존 데이터를 싹 지우고 다시 넣는 방식이 아니라,
        // JPA의 saveAll을 사용하면 ID 유무에 따라 알아서 처리합니다.
        return locationRepository.saveAll(locations);
    }
}