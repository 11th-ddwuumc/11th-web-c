import {Injectable, NotFoundException} from "@nestjs/common";
import {Book} from "./book.entity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {Like, Repository} from "typeorm";
import {BookResponseDto, CreateBookDto} from "./book.dto.js";
import {Category} from "./category.entity.js";

@Injectable()
export class BookService {

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
  }

  async getAllBooks(): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.find({
      relations: {category: true},
      order: {bookId: "DESC"},
    });
    return books.map(BookResponseDto.from);
  }

  async getCategoryBooks(categoryId: number): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.find({
      where: {
        category: {categoryId},
      },
      relations: {
        category: true,
      },
      order: {
        bookId: "DESC",
      },
    });
    return books.map(BookResponseDto.from);
  }

  async createBook(createBookDto: CreateBookDto): Promise<BookResponseDto> {
    const category = await this.categoryRepository.findOneBy({
      categoryId: createBookDto.categoryId,
    });

    if (!category) {
      throw new NotFoundException("존재하지 않는 카테고리입니다.");
    }

    const book = this.bookRepository.create({
      title: createBookDto.title,
      description: createBookDto.description ?? null,
      category,
    });

    const savedBook = await this.bookRepository.save(book);
    return BookResponseDto.from(savedBook);
  }

  async searchBooks(keyword: string): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.find({
      where: {
        title: Like(`%${keyword}%`),
      },
      relations: {
        category: true,
      },
      order: {
        bookId: "DESC",
      },
    });
    return books.map(BookResponseDto.from);
  }
}