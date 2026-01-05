package com.kookil.backend.controller.common;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    // 점(.)이 없는 모든 경로(확장자가 없는 경로)는 React의 index.html로 포워딩
    // 예: /login, /product/1 등은 index.html이 받아서 React Router가 처리함
    @GetMapping(value =  {"/{path:[^\\.]*}", "/**/{path:[^\\.]*}"})
    public String forward() {
        return "forward:/index.html";
    }
}