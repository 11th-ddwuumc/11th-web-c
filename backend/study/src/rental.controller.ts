import { Body, Controller, Post } from '@nestjs/common';
import { RentalService } from './rental.service.js';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  // POST http://localhost:3000/rentals
  @Post()
  async createRental(
    @Body() body: { userId: number; bookId: number },
  ): Promise<string> {
    const { userId, bookId } = body;
    return await this.rentalService.createRental(userId, bookId);
  }
}
