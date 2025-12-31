package com.kookil.backend.dto.category;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kookil.backend.entity.Category;
import lombok.*;

public class CategoryDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String name;
        private int orderIndex;

        @JsonProperty("isVisible")
        private boolean isVisible;

        public Category toEntity() {
            return Category.builder()
                    .name(name)
                    .orderIndex(orderIndex)
                    .isVisible(isVisible)
                    .build();
        }
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String name;
        private int orderIndex;

        @JsonProperty("isVisible")
        private boolean isVisible;

        public Response(Category category) {
            this.id = category.getId();
            this.name = category.getName();
            this.orderIndex = category.getOrderIndex();
            this.isVisible = category.isVisible();
        }
    }
}