package com.kookil.backend.service.menu;

import com.kookil.backend.dto.menu.MenuDto;
import com.kookil.backend.entity.Menu;
import com.kookil.backend.repository.menu.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MenuService {

    private final MenuRepository menuRepository;

    // 전체 조회 (순서대로)
    @Transactional(readOnly = true)
    public List<MenuDto.Response> getAllMenus() {
        return menuRepository.findAllByOrderByOrderIndexAsc().stream()
                .map(MenuDto.Response::new)
                .collect(Collectors.toList());
    }

    // 메뉴 등록
    public void createMenu(MenuDto.Request request) {
        menuRepository.save(request.toEntity());
    }

    // 메뉴 수정
    public void updateMenu(Long id, MenuDto.Request request) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 메뉴입니다. id=" + id));

        // 데이터 갱신
        menu.setName(request.getName());
        menu.setUrl(request.getUrl());
        menu.setOrderIndex(request.getOrderIndex());
        menu.setVisible(request.isVisible()); // DTO 수정으로 인해 이제 true값이 정상적으로 들어옴

        // 명시적 저장 (확실한 업데이트)
        menuRepository.save(menu);
    }

    // 메뉴 삭제
    public void deleteMenu(Long id) {
        menuRepository.deleteById(id);
    }
}