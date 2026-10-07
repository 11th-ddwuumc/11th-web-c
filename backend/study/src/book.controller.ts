import {Body, Controller, Get, Param, ParseIntPipe, Post, Query} from "@nestjs/common";
import {BookService} from "./book.service.js";
import {BookResponseDto, CreateBookDto} from "./book.dto.js";

@Controller("books") // 이 컨트롤러로 들어오는 기본 주소: /books
export class BookController {

  constructor(private readonly bookService: BookService) {
  }

  @Get()
  async getBooks(
    @Query("keyword") keyword?: string,
  ): Promise<BookResponseDto[]> {
    if (keyword) {
      return this.bookService.searchBooks(keyword);
    }
    return this.bookService.getAllBooks();
  }

  @Get("category/:categoryId")
  async getCategoryBooks(
    @Param("categoryId", ParseIntPipe) categoryId: number,
  ): Promise<BookResponseDto[]> {
    return this.bookService.getCategoryBooks(categoryId);
  }

  @Post()
  async createBook(
    @Body() createBookDto: CreateBookDto,
  ): Promise<BookResponseDto> {
    return this.bookService.createBook(createBookDto);
  }
}