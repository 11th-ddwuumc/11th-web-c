package com.umc.study.controller;

import com.umc.study.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping("/books")
    public List<Map<String, Object>> getBooks() {
        return bookService.getAllBooks();
    }

    @PostMapping("/books")
    public String createBook(@RequestBody Map<String, Object> body) {
        bookService.createBook(body);
        return "도서 등록이 완료되었습니다!";
    }

    @GetMapping("/books/category/{categoryId}")
    public List<Map<String, Object>> getBooksByCategory(@PathVariable("categoryId") Long categoryId) {
        return bookService.getBooksByCategoryId(categoryId);
    }

    @PostMapping("/rentals")
    public String createRental(@RequestBody Map<String, Object> body) {
        bookService.createRental(body);
        return "대여 기록이 성공적으로 생성되었습니다.";
    }
}