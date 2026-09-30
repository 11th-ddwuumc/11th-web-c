import {Injectable} from "@nestjs/common";
import {RentalRepository} from "./rental.repository.js";

@Injectable()
export class RentalService {

  constructor(private readonly rentalRepository: RentalRepository) {
  }

  async createRental(body: Record<string, any>): Promise<string> {
    await this.rentalRepository.create(body);
    return "대여 기록이 생성되었습니다!";
  }

  async returnRental(rentalId: number): Promise<string> {
    await this.rentalRepository.updateStatusToReturned(rentalId);
    return `rentalId = ${rentalId} 가 반납되었습니다!`;
  }
}