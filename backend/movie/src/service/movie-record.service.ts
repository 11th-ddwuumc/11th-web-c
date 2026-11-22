import { HttpStatus, Injectable } from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";
import { CreateMovieRecordDto } from "../dto/create-movie-record.dto.js";
import { MovieRecordResponseDto } from "../dto/movie-record-response.dto.js";
import { Member } from "../entity/member.entity.js";
import { Rating } from "../entity/rating.entity.js";
import { Favorite } from "../entity/favorite.entity.js";
import { ApiException } from "../exception/api.exception.js";
import { FavoriteResponseDto } from "../dto/favorite-response.dto.js";
import { RatingResponseDto } from "../dto/rating-response.dto.js";

@Injectable()
export class MovieRecordService {

  constructor(private readonly dataSource: DataSource) {
  }

  async create(memberId: number, dto: CreateMovieRecordDto): Promise<MovieRecordResponseDto> {
    return this.dataSource.transaction(async (em: EntityManager) => {
      // 콜백이 정상적으로 끝날 시 commit, 예외 시 rollback
      // 이 콜백 내에서는 em이 만든 repository만 사용 가능
      const memberRepository = em.getRepository(Member);
      const ratingRepository = em.getRepository(Rating);
      const favoriteRepository = em.getRepository(Favorite);

      const member = await memberRepository.findOneBy({ memberId });
      if (!member) {
        throw new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1", "해당 회원을 찾을 수 없습니다.");
      }

      const existingRating = await ratingRepository.findOne({
        where: { member: { memberId }, movieId: dto.movieId },
      });
      if (existingRating) {
        throw new ApiException(HttpStatus.CONFLICT, "RATING409_1", "이미 이 영화에 평점을 남기셨습니다.");
      }

      if (dto.addToFavorites) {
        const existingFavorite = await favoriteRepository.findOne({
          where: { member: { memberId }, movieId: dto.movieId },
        });
        if (existingFavorite) {
          throw new ApiException(HttpStatus.CONFLICT, "FAVORITE409_1", "이미 이 영화를 즐겨찾기했습니다.");
        }
      }

      const savedRating = await ratingRepository.save(
        ratingRepository.create({
          member: member,
          movieId: dto.movieId,
          score: dto.score,
          comment: dto.comment ?? null,
        }),
      );

      let favoriteResponse: FavoriteResponseDto | null = null;
      if (dto.addToFavorites) {
        const savedFavorite = await favoriteRepository.save(
          favoriteRepository.create({
            member: member,
            movieId: dto.movieId,
          }),
        );
        favoriteResponse = FavoriteResponseDto.from(savedFavorite);
      }

      return MovieRecordResponseDto.of(RatingResponseDto.from(savedRating), favoriteResponse);
    });
  }
}