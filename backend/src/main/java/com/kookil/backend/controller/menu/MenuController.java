package com.kookil.backend.controller.menu;

import com.kookil.backend.dto.menu.MenuDto;
import com.kookil.backend.service.menu.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MenuController {

    private final MenuService menuService;

    // [공통] 메뉴 목록 조회 (로그인 불필요)
    @GetMapping("/menus")
    public List<MenuDto.Response> getMenus() {
        return menuService.getAllMenus();
    }

    // [관리자] 메뉴 등록
    @PostMapping("/admin/menus")
    public String createMenu(@RequestBody MenuDto.Request request) {
        menuService.createMenu(request);
        return "메뉴 등록 완료";
    }

    // [관리자] 메뉴 수정
    @PutMapping("/admin/menus/{id}")
    public String updateMenu(@PathVariable Long id, @RequestBody MenuDto.Request request) {
        menuService.updateMenu(id, request);
        return "메뉴 수정 완료";
    }

    // [관리자] 메뉴 삭제
    @DeleteMapping("/admin/menus/{id}")
    public String deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return "메뉴 삭제 완료";
    }
}