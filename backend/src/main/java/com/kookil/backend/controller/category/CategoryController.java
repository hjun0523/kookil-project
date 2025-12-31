package com.kookil.backend.controller.category;

import com.kookil.backend.dto.category.CategoryDto;
import com.kookil.backend.service.category.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CategoryController {

    private final CategoryService categoryService;

    // [공통] 카테고리 목록 조회
    @GetMapping("/categories")
    public List<CategoryDto.Response> getCategories() {
        return categoryService.getAllCategories();
    }

    // [관리자] 등록
    @PostMapping("/admin/categories")
    public String createCategory(@RequestBody CategoryDto.Request request) {
        categoryService.createCategory(request);
        return "카테고리 등록 완료";
    }

    // [관리자] 수정
    @PutMapping("/admin/categories/{id}")
    public String updateCategory(@PathVariable Long id, @RequestBody CategoryDto.Request request) {
        categoryService.updateCategory(id, request);
        return "카테고리 수정 완료";
    }

    // [관리자] 삭제
    @DeleteMapping("/admin/categories/{id}")
    public String deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return "카테고리 삭제 완료";
    }
}