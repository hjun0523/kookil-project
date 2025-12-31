package com.kookil.backend.repository.product;

import com.kookil.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // 최신순 조회 (EntityGraph로 이미지와 카테고리를 한 번에 가져옴 - 성능 최적화)
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.images LEFT JOIN FETCH p.category ORDER BY p.id DESC")
    List<Product> findAllByOrderByIdDesc();

    // 카테고리별 조회
    List<Product> findByCategoryIdOrderByIdDesc(Long categoryId);
}