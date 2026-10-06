package com.umc.study.service;

import com.umc.study.dto.BookResponse;
import com.umc.study.dto.CreateBookRequest;
import com.umc.study.entity.Book;
import com.umc.study.entity.Category;
import com.umc.study.exception.DuplicateBookException;
import com.umc.study.repository.BookRepository;
import com.umc.study.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    // 전체 도서 조회 + 제목 검색
    @Transactional(readOnly = true)
    public List<BookResponse> getBooks(String keyword) {

        List<Book> books;

        if (keyword == null || keyword.isBlank()) {
            books = bookRepository.findAllByOrderByBookIdDesc();
        } else {
            books = bookRepository
                    .findByTitleContainingOrderByBookIdDesc(keyword);
        }

        return books.stream()
                .map(BookResponse::from)
                .toList();
    }

    // 신규 도서 등록
    @Transactional
    public BookResponse createBook(CreateBookRequest request) {

        if (bookRepository.existsByTitle(request.title())) {
            throw new DuplicateBookException(
                    "이미 등록된 도서 제목입니다."
            );
        }

        Category category = categoryRepository
                .findById(request.categoryId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "존재하지 않는 카테고리입니다."
                        )
                );

        Book book = new Book(
                category,
                request.title(),
                request.description()
        );

        Book savedBook = bookRepository.save(book);

        return BookResponse.from(savedBook);
    }
}