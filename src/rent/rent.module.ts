import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';

@Module({
  providers: [RentService],
  controllers: [RentController]
})
export class RentModule { }
