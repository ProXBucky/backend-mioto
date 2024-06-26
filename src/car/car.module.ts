import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { Car } from './car.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from '../carImage/image.module';
import { FeatureModule } from '../feature/feature.module';
import { CarHasFeatureModule } from '../carHasFeature/carHasFeature.module';
import { ReviewModule } from '../review/review.module';
import { RentModule } from '../rent/rent.module';
import { ReportModule } from '../report/report.module';
import { LikeModule } from '../like/like.module';


@Module({
  imports: [TypeOrmModule.forFeature([Car]), ImageModule, FeatureModule, CarHasFeatureModule, ReviewModule, RentModule, ReportModule, LikeModule],
  providers: [CarService],
  controllers: [CarController],
  exports: [CarService]
})
export class CarModule { }
