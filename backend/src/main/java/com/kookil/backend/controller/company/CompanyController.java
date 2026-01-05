package com.kookil.backend.controller.company;

import com.kookil.backend.entity.OfficeLocation;
import com.kookil.backend.service.company.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    // 1. [공용] 위치 정보 조회
    @GetMapping("/company/locations")
    public ResponseEntity<List<OfficeLocation>> getLocations() {
        return ResponseEntity.ok(companyService.getAllLocations());
    }

    // 2. [관리자] 위치 정보 저장 (수정)
    // SecurityConfig에서 "/api/admin/**" 경로는 관리자 권한이 필요하도록 설정되어 있어야 합니다.
    @PutMapping("/admin/company/locations")
    public ResponseEntity<List<OfficeLocation>> updateLocations(@RequestBody List<OfficeLocation> locations) {
        return ResponseEntity.ok(companyService.saveAllLocations(locations));
    }
}