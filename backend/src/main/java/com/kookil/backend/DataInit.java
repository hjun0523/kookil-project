package com.kookil.backend;

import com.kookil.backend.entity.*;
import com.kookil.backend.repository.category.CategoryRepository;
import com.kookil.backend.repository.member.MemberRepository;
import com.kookil.backend.repository.menu.MenuRepository;
import com.kookil.backend.repository.product.ProductRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInit {

    private final ProductRepository productRepository;
    private final MemberRepository memberRepository;
    private final MenuRepository menuRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        // 1. 관리자 계정 생성 (기존 유지)
        if (memberRepository.count() == 0) {
            System.out.println("========== 👤 초기 관리자 계정 생성 (admin / 1234) ==========");
            Member admin = Member.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("1234"))
                    .name("슈퍼관리자")
                    .role("ROLE_ADMIN")
                    .build();
            memberRepository.save(admin);
        }

        // 2. 기본 메뉴 생성 (기존 유지)
        if (menuRepository.count() == 0) {
            System.out.println("========== 📋 기본 메뉴 데이터 생성 ==========");
            menuRepository.save(Menu.builder().name("전체매물").url("/product").orderIndex(1).isVisible(true).build());
            menuRepository.save(Menu.builder().name("신규등록").url("/new").orderIndex(2).isVisible(true).build());
            menuRepository.save(Menu.builder().name("제조업체정보").url("/info").orderIndex(3).isVisible(true).build());
            menuRepository.save(Menu.builder().name("고객센터").url("/cs").orderIndex(4).isVisible(true).build());
        }

        // 3. [중요] 기본 카테고리 생성 & 샘플 매물 1개 등록 (구조 변경됨!)
        if (categoryRepository.count() == 0) {
            System.out.println("========== 📦 기본 카테고리 & 매물 데이터 생성 ==========");

            // (1) 카테고리 먼저 생성
            String[] catNames = {"머시닝센터", "CNC선반", "범용밀링", "범용선반", "절단기/톱기계", "기타장비"};
            List<Category> categories = Arrays.stream(catNames).map(name ->
                    categoryRepository.save(Category.builder().name(name).orderIndex(1).isVisible(true).build())
            ).toList();

            // (2) 샘플 매물 1개 등록 (Item 대신 Product 사용)
            // 카테고리를 String이 아니라 위에서 만든 객체(categories.get(0))로 연결
            Product sample = Product.builder()
                    .title("두산 머시닝센터 DNM 5700")
                    .productCode(1001L)
                    .manufacturer("두산공작기계")
                    .modelName("DNM 5700")
                    .modelYear("2019년")
                    .basicSpec("테이블 1000x500")
                    .usageStatus("공장사용중")
                    .location("경기 시흥")
                    .price(55000000L)
                    .isPriceOpen(true)
                    .status(ItemStatus.SALE) // 기존 ItemStatus Enum은 그대로 사용
                    .category(categories.get(0)) // "머시닝센터" 카테고리와 연결!
                    .description("상태 매우 양호합니다. 시운전 가능.")
                    .build();

            ProductImage img = ProductImage.builder()
                    .imgUrl("https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7")
                    .isThumbnail(true)
                    .build();
            sample.addImage(img);

            productRepository.save(sample);
        }
    }
}