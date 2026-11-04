// src/book.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { BookRepository } from './book.repository.js';
import { BookResponseDto, CreateBookDto } from './book.dto.js';

@Injectable()
export class BookService {
  // 창고지기(BookRepository)를 주입받습니다.
  constructor(private readonly bookRepository: BookRepository) {}

  async getAllBooks(): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.findAll();
    return books.map((book) => BookResponseDto.from(book));
  }

  async createBook(dto: CreateBookDto): Promise<BookResponseDto> {
    const category = await this.bookRepository.findCategoryById(dto.categoryId);
    if (!category) {
      throw new NotFoundException(
        `존재하지 않는 카테고리입니다. (categoryId: ${dto.categoryId})`,
      );
    }
    const book = await this.bookRepository.create(dto, category);
    return BookResponseDto.from(book);
  }

  async getBooksByCategory(categoryId: number): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.findByCategoryId(categoryId);
    return books.map((book) => BookResponseDto.from(book));
  }
}
