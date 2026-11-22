import { INestApplication, ValidationPipe } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import request from "supertest";
import { Repository } from "typeorm";
import { RatingController } from "../src/controller/rating.controller.js";
import { Member } from "../src/entity/member.entity.js";
import { Rating } from "../src/entity/rating.entity.js";
import { HttpExceptionFilter } from "../src/filter/http-exception.filter.js";
import { RatingService } from "../src/service/rating.service.js";

describe("평점 API (통합 테스트)", () => {
  let app: INestApplication;
  let ratingRepository: Repository<Rating>;
  let member: Member;
  let authorization: string;

  beforeAll(async () => {
    // 테스트 전용 메모리 DB로 실제 Repository와 서비스까지 함께 검증합니다.
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqljs",
          autoSave: false,
          entities: [Member, Rating],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Member, Rating]),
        JwtModule.register({
          global: true,
          secret: "test-secret-for-rating-only",
          signOptions: { expiresIn: 3600 },
        }),
      ],
      controllers: [RatingController],
      providers: [RatingService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    const memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    ratingRepository = module.get(getRepositoryToken(Rating));
    member = await memberRepository.save(memberRepository.create({
      email: "rating-test@umc.com",
      password: "unused-test-password",
      nickname: "평점테스트회원",
    }));
    const token = module.get(JwtService).sign({
      sub: String(member.memberId),
      email: member.email,
    });
    authorization = `Bearer ${token}`;
  });

  beforeEach(async () => {
    await ratingRepository.clear();
  });

  afterAll(async () => {
    await app?.close();
  });

  it("토큰 없이 POST /ratings를 호출하면 401을 응답한다", async () => {
    const response = await request(app.getHttpServer())
      .post("/ratings")
      .send({ movieId: 550, score: 5 })
      .expect(401);

    expect(response.body).toMatchObject({ isSuccess: false, code: "AUTH401_2" });
    expect(await ratingRepository.count()).toBe(0);
  });

  it("유효한 토큰으로 POST /ratings를 호출하면 201을 응답하고 평점을 저장한다", async () => {
    const response = await request(app.getHttpServer())
      .post("/ratings")
      .set("Authorization", authorization)
      .send({ movieId: 550, score: 5, comment: "최고의 영화" })
      .expect(201);

    expect(response.body).toMatchObject({
      isSuccess: true,
      code: "COMMON201",
      result: { ratingId: expect.any(Number), movieId: 550, score: 5, comment: "최고의 영화" },
    });
    const saved = await ratingRepository.findOne({
      where: { ratingId: response.body.result.ratingId },
      relations: { member: true },
    });
    expect(saved).toMatchObject({
      movieId: 550,
      score: 5,
      comment: "최고의 영화",
      member: { memberId: member.memberId },
    });
    expect(await ratingRepository.count()).toBe(1);
  });
});
