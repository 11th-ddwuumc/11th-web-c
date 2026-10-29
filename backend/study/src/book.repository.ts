// src/book.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Book } from './book.entity.js';
import { CreateBookDto } from './book.dto.js';
import { Category } from './category.entity.js';

@Injectable()
export class BookRepository {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find({
      relations: { category: true },
      order: { bookId: 'DESC' },
    });
  }

  async findByCategoryId(categoryId: number): Promise<Book[]> {
    return await this.bookRepository.find({
      where: { category: { categoryId } },
      relations: { category: true },
    });
  }

  async findCategoryById(categoryId: number): Promise<Category | null> {
    return await this.categoryRepository.findOneBy({ categoryId });
  }

  async create(dto: CreateBookDto, category: Category): Promise<Book> {
    const book = this.bookRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      category,
    });
    return await this.bookRepository.save(book);
  }
}
