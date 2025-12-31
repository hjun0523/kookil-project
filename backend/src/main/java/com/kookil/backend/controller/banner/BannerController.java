package com.kookil.backend.controller.banner;

import com.kookil.backend.dto.banner.BannerDto;
import com.kookil.backend.service.banner.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BannerController {

    private final BannerService bannerService;

    // 목록 조회
    @GetMapping("/banners")
    public List<BannerDto.Response> getBanners(@RequestParam(defaultValue = "MAIN") String type) {
        return bannerService.getBanners(type);
    }

    // [관리자] 등록
    @PostMapping("/admin/banners")
    public String createBanner(@RequestBody BannerDto.Request request) {
        bannerService.createBanner(request);
        return "등록 완료";
    }

    // [관리자] 수정
    @PutMapping("/admin/banners/{id}")
    public String updateBanner(@PathVariable Long id, @RequestBody BannerDto.Request request) {
        bannerService.updateBanner(id, request);
        return "수정 완료";
    }

    // [관리자] 삭제
    @DeleteMapping("/admin/banners/{id}")
    public String deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        return "삭제 완료";
    }
}