import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { Car } from './car.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarCarFeature } from './carCarFeature.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Car, CarCarFeature])],
  providers: [CarService],
  controllers: [CarController]
})
export class CarModule { }
