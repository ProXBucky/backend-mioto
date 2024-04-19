import { Module } from '@nestjs/common';
import { CarService } from './car/car.service';
import { ImageService } from './image/image.service';
import { FeatureService } from './feature/feature.service';
import { CarController } from './car/car.controller';
import { ImageController } from './image/image.controller';
import { FeatureController } from './feature/feature.controller';

@Module({
  providers: [CarService, ImageService, FeatureService],
  controllers: [CarController, ImageController, FeatureController]
})
export class CarModule {}
