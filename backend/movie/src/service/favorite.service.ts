import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Favorite } from "../entity/favorite.entity.js";
import { Repository } from "typeorm";
import { Member } from "../entity/member.entity.js";
import { CreateFavoriteDto } from "../dto/create-favorite.dto.js";
import { FavoriteResponseDto } from "../dto/favorite-response.dto.js";
import { ApiException } from "../exception/api.exception.js";
import { FavoriteStatusResponseDto } from "../dto/favorite-status-response.dto.js";

@Injectable()
export class FavoriteService {

  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {
  }

  /**
   * 새로운 영화 즐겨찾기 생성
   */
  async create(memberId: number, dto: CreateFavoriteDto): Promise<FavoriteResponseDto> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1", "해당 회원을 찾을 수 없습니다.");
    }

    const existing = await this.favoriteRepository.findOne({
      where: { member: { memberId }, movieId: dto.movieId },
    });
    if (existing) {
      throw new ApiException(HttpStatus.CONFLICT, "FAVORITE409_1", "이미 이 영화를 즐겨찾기했습니다.");
    }

    const saved = await this.favoriteRepository.save(
      this.favoriteRepository.create({ member, movieId: dto.movieId }),
    );
    return FavoriteResponseDto.from(saved);
  }

  /**
   * 내 영화 즐겨찾기 목록을 반환
   */
  async getMyFavorites(memberId: number): Promise<FavoriteResponseDto[]> {
    const favorites = await this.favoriteRepository.find({
      where: { member: { memberId } },
      order: { favoriteId: "DESC" },
    });
    return favorites.map(FavoriteResponseDto.from);
  }

  /**
   * 특정 영화를 즐겨찾기했는지 여부 반환
   */
  async getStatus(memberId: number, movieId: number): Promise<FavoriteStatusResponseDto> {
    const isFavorite = await this.favoriteRepository.exists({
      where: { member: { memberId }, movieId },
    });
    return FavoriteStatusResponseDto.from(isFavorite);
  }

  /**
   * 특정 영화 즐겨찾기를 삭제
   */
  async delete(memberId: number, movieId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { member: { memberId }, movieId },
    });
    if (!favorite) {
      throw new ApiException(HttpStatus.NOT_FOUND, "FAVORITE404_1", "해당 영화 즐겨찾기를 찾을 수 없습니다.");
    }

    await this.favoriteRepository.remove(favorite);
  }
}