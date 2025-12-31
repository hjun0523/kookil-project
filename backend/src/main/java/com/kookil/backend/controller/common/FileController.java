package com.kookil.backend.controller.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/common")
public class FileController {

    // WebMvcConfig와 동일한 경로 설정
    private final String uploadDir = Paths.get("./uploads").toAbsolutePath().toString();

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 없습니다.");
        }

        try {
            // 1. 폴더가 없으면 생성
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // 2. 파일명 중복 방지를 위해 UUID 붙이기
            String originalName = file.getOriginalFilename();
            String saveName = UUID.randomUUID().toString() + "_" + originalName;

            // 3. 저장
            Path savePath = Paths.get(uploadDir, saveName);
            file.transferTo(savePath.toFile());

            // 4. 접근 가능한 URL 반환 (/uploads/파일명)
            return ResponseEntity.ok("/uploads/" + saveName);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("파일 업로드 실패");
        }
    }
}