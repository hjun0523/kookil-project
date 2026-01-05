package com.kookil.backend.repository.product;

import com.kookil.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // 1. 전체 조회 (페이징 적용)
    // N+1 문제 방지를 위해 EntityGraph 사용 (category와 images를 한 번에 로딩)
    // countQuery는 가벼운 쿼리로 별도 작성하여 성능 향상
    @EntityGraph(attributePaths = {"category", "images"})
    @Query(value = "SELECT p FROM Product p ORDER BY p.id DESC",
            countQuery = "SELECT count(p) FROM Product p")
    Page<Product> findAllByOrderByIdDesc(Pageable pageable);

    // 2. 카테고리별 조회 (페이징 적용)
    @EntityGraph(attributePaths = {"category", "images"})
    @Query(value = "SELECT p FROM Product p WHERE p.category.id = :categoryId ORDER BY p.id DESC",
            countQuery = "SELECT count(p) FROM Product p WHERE p.category.id = :categoryId")
    Page<Product> findByCategoryIdOrderByIdDesc(@Param("categoryId") Long categoryId, Pageable pageable);
}