package com.kookil.backend.repository.banner;

import com.kookil.backend.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long> {
    // 타입별(MAIN, LOGO)로 순서대로 조회
    List<Banner> findAllByTypeOrderByOrderIndexAsc(String type);
}