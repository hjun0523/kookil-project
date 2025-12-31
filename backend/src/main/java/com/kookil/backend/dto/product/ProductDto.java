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
        private boolean isPriceOpen; // 가격 공개 여부

        private ItemStatus status;
        private Long categoryId;     // 선택한 카테고리 ID
        private String description;

        private List<String> imageUrls; // 업로드된 이미지 URL 리스트 (0번이 썸네일)
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
        private String categoryName;    // 카테고리명
        private String description;
        private List<String> images;    // 이미지 URL 리스트

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
                this.categoryName = product.getCategory().getName();
            }

            this.description = product.getDescription();

            this.images = product.getImages().stream()
                    .map(ProductImage::getImgUrl)
                    .collect(Collectors.toList());
        }
    }
}