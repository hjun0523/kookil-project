package com.kookil.backend.service.product;

import com.kookil.backend.dto.product.ProductDto;
import com.kookil.backend.entity.Category;
import com.kookil.backend.entity.Product;
import com.kookil.backend.entity.ProductImage;
import com.kookil.backend.repository.category.CategoryRepository;
import com.kookil.backend.repository.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // 👇 [수정] 페이징 + 카테고리 필터링 조회
    @Transactional(readOnly = true)
    public Page<ProductDto.Response> getProducts(int page, int size, Long categoryId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage;

        if (categoryId != null) {
            // 카테고리가 지정된 경우
            productPage = productRepository.findByCategoryIdOrderByIdDesc(categoryId, pageable);
        } else {
            // 전체 조회인 경우
            productPage = productRepository.findAllByOrderByIdDesc(pageable);
        }

        // Entity -> DTO 변환
        return productPage.map(ProductDto.Response::new);
    }

    // 상세 조회
    @Transactional(readOnly = true)
    public ProductDto.Response getProductDetail(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("매물이 없습니다. id=" + id));
        return new ProductDto.Response(product);
    }

    // 등록
    public void createProduct(ProductDto.Request request) {
        Category category = getCategoryOrThrow(request.getCategoryId());

        Product product = Product.builder()
                .title(request.getTitle())
                .productCode(request.getProductCode() != null ? request.getProductCode() : System.currentTimeMillis() / 1000)
                .manufacturer(request.getManufacturer())
                .modelName(request.getModelName())
                .modelYear(request.getModelYear())
                .basicSpec(request.getBasicSpec())
                .usageStatus(request.getUsageStatus())
                .location(request.getLocation())
                .price(request.getPrice())
                .isPriceOpen(request.isPriceOpen())
                .status(request.getStatus())
                .category(category)
                .description(request.getDescription())
                .build();

        saveImages(product, request.getImageUrls());
        productRepository.save(product);
    }

    // 수정
    public void updateProduct(Long id, ProductDto.Request request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 매물입니다. id=" + id));

        Category category = getCategoryOrThrow(request.getCategoryId());

        product.setTitle(request.getTitle());
        product.setCategory(category);
        product.setProductCode(request.getProductCode());
        product.setManufacturer(request.getManufacturer());
        product.setModelName(request.getModelName());
        product.setModelYear(request.getModelYear());
        product.setBasicSpec(request.getBasicSpec());
        product.setUsageStatus(request.getUsageStatus());
        product.setLocation(request.getLocation());
        product.setPrice(request.getPrice());
        product.setPriceOpen(request.isPriceOpen());
        product.setStatus(request.getStatus());
        product.setDescription(request.getDescription());

        product.getImages().clear();
        saveImages(product, request.getImageUrls());

        // Dirty checking으로 자동 저장되지만 명시적 호출
        productRepository.save(product);
    }

    // 삭제
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // --- 헬퍼 메소드 ---
    private Category getCategoryOrThrow(Long categoryId) {
        if (categoryId == null) throw new IllegalArgumentException("카테고리 ID는 필수입니다.");
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));
    }

    private void saveImages(Product product, List<String> imageUrls) {
        if (imageUrls != null && !imageUrls.isEmpty()) {
            for (int i = 0; i < imageUrls.size(); i++) {
                ProductImage image = ProductImage.builder()
                        .imgUrl(imageUrls.get(i))
                        .isThumbnail(i == 0)
                        .build();
                product.addImage(image);
            }
        }
    }
}