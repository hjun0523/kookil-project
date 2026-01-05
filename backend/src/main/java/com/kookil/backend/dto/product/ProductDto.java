package com.kookil.backend.dto.product;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kookil.backend.entity.ItemStatus;
import com.kookil.backend.entity.Product;
import com.kookil.backend.entity.ProductImage;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

public class ProductDto {

    // 등록/수정 요청
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String title;
        private Long productCode;
        private String manufacturer;
        private String modelName;
        private String modelYear;
        private String basicSpec;
        private String usageStatus;
        private String location;
        private Long price;

        @JsonProperty("isPriceOpen")
        private boolean isPriceOpen;

        private ItemStatus status;
        private Long categoryId;
        private String description;

        private List<String> imageUrls;
    }

    // 목록/상세 응답
    @Getter
    @Builder
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String title;
        private Long productCode;
        private String manufacturer;
        private String modelName;
        private String modelYear;
        private String basicSpec;
        private String usageStatus;
        private String location;
        private Long price;

        @JsonProperty("isPriceOpen")
        private boolean isPriceOpen;

        private ItemStatus status;
        private Long categoryId;        // 👈 [추가] 필터링을 위해 ID 추가
        private String categoryName;
        private String description;
        private List<String> images;

        public Response(Product product) {
            this.id = product.getId();
            this.title = product.getTitle();
            this.productCode = product.getProductCode();
            this.manufacturer = product.getManufacturer();
            this.modelName = product.getModelName();
            this.modelYear = product.getModelYear();
            this.basicSpec = product.getBasicSpec();
            this.usageStatus = product.getUsageStatus();
            this.location = product.getLocation();
            this.price = product.getPrice();
            this.isPriceOpen = product.isPriceOpen();
            this.status = product.getStatus();

            if (product.getCategory() != null) {
                this.categoryId = product.getCategory().getId(); // 👈 ID 매핑
                this.categoryName = product.getCategory().getName();
            }

            this.description = product.getDescription();

            this.images = product.getImages().stream()
                    .map(ProductImage::getImgUrl)
                    .collect(Collectors.toList());
        }
    }
}