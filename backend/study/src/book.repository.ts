import {Inject, Injectable} from "@nestjs/common";
import type {Pool} from "mysql2/promise";
import {DATABASE_CONNECTION} from "./database.provider.js";

@Injectable()
export class BookRepository {

  constructor(
    @Inject(DATABASE_CONNECTION) private pool: Pool,
  ) {
  }

  async findAll(): Promise<any> {
    const sql = "SELECT * FROM BOOK";
    const [rows] = await this.pool.query(sql);
    return rows;
  }

  async findByCategory(categoryId: number): Promise<any> {
    const sql = "SELECT * FROM BOOK WHERE CATEGORY_ID = ?";
    const [result] = await this.pool.query(sql, [categoryId]);
    return result;
  }

  async create(body: Record<string, any>): Promise<any> {
    const sql = "INSERT INTO BOOK (CATEGORY_ID, TITLE, DESCRIPTION, IS_AVAILABLE) VALUES (?, ?, ?, TRUE)";
    // 두 번째 인자로 넘긴 배열이 ? 자리에 순서대로 안전하게 바인딩됩니다.
    const [result] = await this.pool.execute(sql, [
      body.categoryId,
      body.title,
      body.description,
    ]);
    return result;
  }
}