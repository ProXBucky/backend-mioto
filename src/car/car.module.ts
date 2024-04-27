import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { Car } from './car.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerModule } from '../owner/owner.module';
import { ImageModule } from '../carImage/image.module';
import { FeatureModule } from '../feature/feature.module';
import { CarHasFeatureModule } from '../carHasFeature/carHasFeature.module';


@Module({
  imports: [TypeOrmModule.forFeature([Car]), OwnerModule, ImageModule, FeatureModule, CarHasFeatureModule],
  providers: [CarService],
  controllers: [CarController]
})
export class CarModule { }
