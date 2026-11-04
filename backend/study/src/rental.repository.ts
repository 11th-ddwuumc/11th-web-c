import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from './database.provider.js';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class RentalRepository {
  constructor(@Inject(DATABASE_CONNECTION) private readonly pool: Pool) {}

  async create(userId: number, bookId: number): Promise<void> {
    const sql =
      'INSERT INTO rental (user_id, book_id, rented_at, due_at) ' +
      'VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))';
    await this.pool.query(sql, [userId, bookId]);
  }
}
