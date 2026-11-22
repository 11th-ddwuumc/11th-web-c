import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { vi } from "vitest";
import { Member } from "../entity/member.entity.js";
import { Rating } from "../entity/rating.entity.js";
import { ApiException } from "../exception/api.exception.js";
import { RatingService } from "./rating.service.js";

describe("RatingService", () => {
  let service: RatingService;
  const ratingRepository = { findOne: vi.fn(), save: vi.fn() };
  const memberRepository = { findOneBy: vi.fn() };

  beforeEach(async () => {
    vi.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        RatingService,
        { provide: getRepositoryToken(Rating), useValue: ratingRepository },
        { provide: getRepositoryToken(Member), useValue: memberRepository },
      ],
    }).compile();
    service = module.get(RatingService);
  });

  it("같은 영화에 평점을 중복 등록하면 RATING409_1 예외를 던진다", async () => {
    memberRepository.findOneBy.mockResolvedValue({ memberId: 1 });
    ratingRepository.findOne.mockResolvedValue({ ratingId: 1, movieId: 550 });

    await expect(service.create(1, { movieId: 550, score: 5 })).rejects.toMatchObject(
      new ApiException(409, "RATING409_1", "이미 이 영화에 평점을 남기셨습니다."),
    );
    expect(ratingRepository.findOne).toHaveBeenCalledWith({
      where: { member: { memberId: 1 }, movieId: 550 },
    });
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });

  it("남의 평점을 수정하려 하면 RATING403_1 예외를 던진다", async () => {
    const rating = { ratingId: 1, member: { memberId: 2 }, score: 3, comment: "원래 후기" };
    ratingRepository.findOne.mockResolvedValue(rating);

    await expect(service.update(1, 1, { score: 5 })).rejects.toMatchObject(
      new ApiException(403, "RATING403_1", "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다."),
    );
    expect(ratingRepository.findOne).toHaveBeenCalledWith({
      where: { ratingId: 1 },
      relations: { member: true },
    });
    expect(rating.score).toBe(3);
    expect(rating.comment).toBe("원래 후기");
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });
});
