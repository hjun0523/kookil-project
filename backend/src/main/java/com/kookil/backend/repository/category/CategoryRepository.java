package com.kookil.backend.repository.category;

import com.kookil.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // 순서대로 조회
    List<Category> findAllByOrderByOrderIndexAsc();
}