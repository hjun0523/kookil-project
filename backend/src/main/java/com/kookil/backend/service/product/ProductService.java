package com.kookil.backend.service.product;

import com.kookil.backend.dto.product.ProductDto;
import com.kookil.backend.entity.Category;
import com.kookil.backend.entity.Product;
import com.kookil.backend.entity.ProductImage;
import com.kookil.backend.repository.category.CategoryRepository;
import com.kookil.backend.repository.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // 전체 조회
    @Transactional(readOnly = true)
    public List<ProductDto.Response> getAllProducts() {
        return productRepository.findAllByOrderByIdDesc().stream()
                .map(ProductDto.Response::new)
                .collect(Collectors.toList());
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

        // 이미지 처리
        saveImages(product, request.getImageUrls());

        productRepository.save(product);
    }

    // 👇 [추가] 수정 로직
    public void updateProduct(Long id, ProductDto.Request request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 매물입니다. id=" + id));

        Category category = getCategoryOrThrow(request.getCategoryId());

        // 정보 갱신 (Dirty Checking)
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

        // 이미지 갱신 (기존 이미지 싹 지우고, 새로 들어온 리스트로 교체 - 순서 보장)
        product.getImages().clear();
        saveImages(product, request.getImageUrls());

        // save 호출은 필요 없지만 명시적으로 작성 가능
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
                        .isThumbnail(i == 0) // 0번 인덱스가 썸네일
                        .build();
                product.addImage(image);
            }
        }
    }
}