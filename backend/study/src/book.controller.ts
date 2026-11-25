// src/book.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service.js';
import { BookResponseDto, CreateBookDto } from './book.dto.js';

@Controller('books') // 이 컨트롤러로 들어오는 기본 주소: /books
export class BookController {
  // 주방장(BookService)을 주입받습니다.
  constructor(private readonly bookService: BookService) {}

  // HTTP GET 방식으로 /books 요청이 들어왔을 때 실행되는 핸들러
  @Get()
  async getBooks(): Promise<BookResponseDto[]> {
    return await this.bookService.getAllBooks();
  }

  // POST http://localhost:3000/books
  @Post()
  async createBook(@Body() dto: CreateBookDto): Promise<BookResponseDto> {
    return await this.bookService.createBook(dto);
  }

  // GET http://localhost:3000/books/category/:category_id
  @Get('category/:category_id')
  async getBooksByCategory(
    @Param('category_id', ParseIntPipe) categoryId: number,
  ): Promise<BookResponseDto[]> {
    return await this.bookService.getBooksByCategory(categoryId);
  }
}
