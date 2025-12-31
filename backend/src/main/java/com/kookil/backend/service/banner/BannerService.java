package com.kookil.backend.service.banner;

import com.kookil.backend.dto.banner.BannerDto;
import com.kookil.backend.entity.Banner;
import com.kookil.backend.repository.banner.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BannerService {

    private final BannerRepository bannerRepository;

    // 조회
    @Transactional(readOnly = true)
    public List<BannerDto.Response> getBanners(String type) {
        return bannerRepository.findAllByTypeOrderByOrderIndexAsc(type).stream()
                .map(BannerDto.Response::new)
                .collect(Collectors.toList());
    }

    // 등록
    public void createBanner(BannerDto.Request request) {
        bannerRepository.save(request.toEntity());
    }

    // 수정
    public void updateBanner(Long id, BannerDto.Request request) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("배너가 존재하지 않습니다. id=" + id));

        // 데이터 갱신
        banner.setType(request.getType());
        banner.setTitle(request.getTitle());
        banner.setLinkUrl(request.getLinkUrl());
        banner.setOrderIndex(request.getOrderIndex());
        banner.setVisible(request.isVisible()); // DTO 덕분에 true가 제대로 들어옴

        // 이미지가 변경된 경우에만 업데이트 (빈 문자열이면 기존 유지)
        if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            banner.setImageUrl(request.getImageUrl());
        }

        bannerRepository.save(banner);
    }

    // 삭제
    public void deleteBanner(Long id) {
        bannerRepository.deleteById(id);
    }
}