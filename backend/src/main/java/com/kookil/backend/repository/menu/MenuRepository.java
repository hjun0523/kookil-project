package com.kookil.backend.repository.menu;

import com.kookil.backend.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    // 순서대로 정렬해서 가져오기
    List<Menu> findAllByOrderByOrderIndexAsc();
}