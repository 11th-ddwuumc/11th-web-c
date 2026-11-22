import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./filter/http-exception.filter.js";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정
  const swaggerConfig = new DocumentBuilder()
    .setTitle("영화 평점 API 서비스")
    .setDescription("UMC 11기 백엔드 워크북에서 만든 회원/평점/즐겨찾기 API 문서입니다")
    .setVersion("v1")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "bearerAuth",
    )
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger-ui", app, document); // http://localhost:3000/swagger-ui

  // cors 설정
  app.enableCors({
    origin: "http://localhost:5173", // 이 출처에서 오는 요청만 허용
    methods: [ "GET", "POST", "PATCH", "DELETE" ],
  });

  // 전역 예외 처리
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
