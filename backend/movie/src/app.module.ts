import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Member } from "./entity/member.entity";
import { Rating } from "./entity/rating.entity";
import { Favorite } from "./entity/favorite.entity";
import { MemberController } from "./controller/member.controller";
import { RatingController } from "./controller/rating.controller";
import { AuthController } from "./controller/auth.controller";
import { FavoriteController } from "./controller/favorite.controller";
import { MovieRecordController } from "./controller/movie-record.controller";
import { MemberService } from "./service/member.service";
import { RatingService } from "./service/rating.service";
import { AuthService } from "./service/auth.service";
import { FavoriteService } from "./service/favorite.service";
import { MovieRecordService } from "./service/movie-record.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Member, Rating, Favorite]),
    JwtModule.registerAsync({
      global: true, // 전역 등록해두면 어느 서비스에서든 JwtService를 주입받을 수 있습니다
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          // 초 단위 숫자로 넘깁니다. 환경변수는 문자열로 들어오므로 Number()로 바꿔주세요.
          expiresIn: Number(configService.get<string>('JWT_ACCESS_EXPIRATION') ?? 3600),
        },
      }),
    }),
  ],
  controllers: [
    MemberController,
    RatingController,
    AuthController,
    FavoriteController,
    MovieRecordController,
  ],
  providers: [
    MemberService,
    RatingService,
    AuthService,
    FavoriteService,
    MovieRecordService,
  ],
})
export class AppModule {}
