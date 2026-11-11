import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module.js";
import {ValidationPipe} from "@nestjs/common";
import {HttpExceptionFilter} from "./filter/http-exception.filter.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cors 설정
  app.enableCors({
    origin: "http://localhost:5173", // 이 출처에서 오는 요청만 허용
    methods: ["GET", "POST", "PATCH", "DELETE"],
  });

  // 전역 예외 처리
  app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true, transform: true}));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
