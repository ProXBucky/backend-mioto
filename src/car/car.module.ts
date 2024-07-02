import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './car.entity';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { ImageModule } from '../carImage/image.module';
import { FeatureModule } from '../feature/feature.module';
import { CarHasFeatureModule } from "../carHasFeature/carHasFeature.module"
import { ReviewModule } from '../review/review.module';
import { RentModule } from '../rent/rent.module';
import { ReportModule } from '../report/report.module';
import { LikeModule } from '../like/like.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car]),
    ImageModule,
    FeatureModule,
    CarHasFeatureModule,
    ReviewModule,
    forwardRef(() => RentModule), // Sử dụng forwardRef để tránh phụ thuộc vòng tròn
    ReportModule,
    LikeModule,
  ],
  providers: [CarService],
  controllers: [CarController],
  exports: [CarService],
})
export class CarModule { }
