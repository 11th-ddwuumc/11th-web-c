import { Injectable } from '@nestjs/common';
import { RentalRepository } from './rental.repository.js';

@Injectable()
export class RentalService {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async createRental(userId: number, bookId: number): Promise<string> {
    await this.rentalRepository.create(userId, bookId);
    return '대여가 완료되었습니다!';
  }
}
