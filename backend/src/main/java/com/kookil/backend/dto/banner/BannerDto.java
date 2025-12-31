package com.kookil.backend.dto.banner;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kookil.backend.entity.Banner;
import lombok.*;

public class BannerDto {

    // 등록 및 수정 요청용
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String type;      // MAIN, LOGO
        private String title;
        private String imageUrl;
        private String linkUrl;
        private int orderIndex;

        // 👇 [핵심] JSON의 "isVisible"을 강제로 매핑
        @JsonProperty("isVisible")
        private boolean isVisible;

        public Banner toEntity() {
            return Banner.builder()
                    .type(type)
                    .title(title)
                    .imageUrl(imageUrl)
                    .linkUrl(linkUrl)
                    .orderIndex(orderIndex)
                    .isVisible(isVisible)
                    .build();
        }
    }

    // 응답용
    @Getter
    @Builder
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String type;
        private String title;
        private String imageUrl;
        private String linkUrl;
        private int orderIndex;

        @JsonProperty("isVisible")
        private boolean isVisible;

        public Response(Banner banner) {
            this.id = banner.getId();
            this.type = banner.getType();
            this.title = banner.getTitle();
            this.imageUrl = banner.getImageUrl();
            this.linkUrl = banner.getLinkUrl();
            this.orderIndex = banner.getOrderIndex();
            this.isVisible = banner.isVisible();
        }
    }
}