import {Inject, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import type {Pool, ResultSetHeader} from "mysql2/promise";
import {DATABASE_CONNECTION} from "./database.provider.js";

@Injectable()
export class RentalRepository {

  constructor(
    @Inject(DATABASE_CONNECTION) private pool: Pool,
  ) {
  }

  async create(body: Record<string, any>): Promise<any> {
    const sql = "INSERT INTO rental (user_id, book_id, rented_at, due_at) VALUES (?, ?, now(), date_add(now(), INTERVAL 7 DAY))";
    const [result] = await this.pool.execute(sql, [
      body.userId,
      body.bookId,
    ]);
    return result;
  }

  async updateStatusToReturned(rentalId: number): Promise<Number> {
    const sql = "UPDATE rental SET returned_at = now() WHERE rental_id = ? AND returned_at IS NULL";
    let result: ResultSetHeader;

    try {
      [result] = await this.pool.execute<ResultSetHeader>(
        sql,
        [rentalId],
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `rentalId = ${rentalId} 반납에 실패했습니다.`,
      );
    }

    if (result.affectedRows === 0) {
      throw new NotFoundException(
        `rentalId = ${rentalId} 를 찾을 수 없습니다.`,
      );
    }

    return result.affectedRows;
  }
}