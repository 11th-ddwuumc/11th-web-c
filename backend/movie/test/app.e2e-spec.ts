import {Test, TestingModule} from "@nestjs/testing";
import {INestApplication} from "@nestjs/common";
import request from "supertest";
import {App} from "supertest/types.js";
import {AppModule} from "./../src/app.module.js";

describe("Members API (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/members/nickname/:nickname (GET)", async () => {
    const response = await request(app.getHttpServer())
      .get("/members/nickname/e2e-test")
      .expect(200);

    expect(response.body).toEqual({
      available: expect.any(Boolean),
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
