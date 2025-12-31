package com.kookil.backend.dto.menu;

import com.fasterxml.jackson.annotation.JsonProperty; // 👈 추가
import com.kookil.backend.entity.Menu;
import lombok.*;

public class MenuDto {

    // 등록 및 수정 요청
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String name;
        private String url;
        private int orderIndex;

        // 👇 [수정] JSON 필드명을 "isVisible"로 강제 지정하여 매핑 오류 해결
        @JsonProperty("isVisible")
        private boolean isVisible;

        public Menu toEntity() {
            return Menu.builder()
                    .name(name)
                    .url(url)
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
        private String name;
        private String url;
        private int orderIndex;

        // 👇 [수정] 응답 나갈 때도 "isVisible"로 나가도록 강제 지정
        @JsonProperty("isVisible")
        private boolean isVisible;

        public Response(Menu menu) {
            this.id = menu.getId();
            this.name = menu.getName();
            this.url = menu.getUrl();
            this.orderIndex = menu.getOrderIndex();
            this.isVisible = menu.isVisible();
        }
    }
}