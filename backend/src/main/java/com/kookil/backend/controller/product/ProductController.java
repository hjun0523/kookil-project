package com.kookil.backend.controller.product;

import com.kookil.backend.dto.product.ProductDto;
import com.kookil.backend.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // 👇 [수정] 목록 조회 (페이징 + 필터링)
    @GetMapping("/products")
    public Page<ProductDto.Response> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) Long categoryId // 카테고리 필터 (선택)
    ) {
        return productService.getProducts(page, size, categoryId);
    }

    // 상세 조회
    @GetMapping("/products/{id}")
    public ProductDto.Response getProductDetail(@PathVariable Long id) {
        return productService.getProductDetail(id);
    }

    // [관리자] 등록
    @PostMapping("/admin/products")
    public String createProduct(@RequestBody ProductDto.Request request) {
        productService.createProduct(request);
        return "매물 등록 완료";
    }

    // [관리자] 수정
    @PutMapping("/admin/products/{id}")
    public String updateProduct(@PathVariable Long id, @RequestBody ProductDto.Request request) {
        productService.updateProduct(id, request);
        return "매물 수정 완료";
    }

    // [관리자] 삭제
    @DeleteMapping("/admin/products/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return "매물 삭제 완료";
    }
}