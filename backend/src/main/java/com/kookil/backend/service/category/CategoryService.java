package com.kookil.backend.service.category;

import com.kookil.backend.dto.category.CategoryDto;
import com.kookil.backend.entity.Category;
import com.kookil.backend.repository.category.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // 조회
    @Transactional(readOnly = true)
    public List<CategoryDto.Response> getAllCategories() {
        return categoryRepository.findAllByOrderByOrderIndexAsc().stream()
                .map(CategoryDto.Response::new)
                .collect(Collectors.toList());
    }

    // 등록
    public void createCategory(CategoryDto.Request request) {
        categoryRepository.save(request.toEntity());
    }

    // 수정
    public void updateCategory(Long id, CategoryDto.Request request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다. id=" + id));

        category.setName(request.getName());
        category.setOrderIndex(request.getOrderIndex());
        category.setVisible(request.isVisible());

        categoryRepository.save(category);
    }

    // 삭제
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}