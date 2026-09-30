import {Body, Controller, Get, Param, ParseIntPipe, Post} from "@nestjs/common";
import {BookService} from "./book.service.js";

@Controller("books") // 이 컨트롤러로 들어오는 기본 주소: /books
export class BookController {

  constructor(private readonly bookService: BookService) {
  }

  @Get()
  async getBooks(): Promise<any> {
    return await this.bookService.getAllBooks();
  }

  @Get("category/:categoryId")
  async getCategoryBooks(@Param("categoryId", ParseIntPipe) categoryId: number): Promise<any> {
    return await this.bookService.getCategoryBooks(categoryId);
  }

  @Post()
  async createBook(@Body() body: Record<string, any>): Promise<string> {
    return await this.bookService.createBook(body);
  }
}