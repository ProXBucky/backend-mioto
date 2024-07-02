import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from './rent.entity';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { CarModule } from '../car/car.module';
import { PaymentModule } from '../payment/payment.module';
import { VoucherModule } from '../voucher/voucher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rent]),
    forwardRef(() => CarModule), // Sử dụng forwardRef để tránh phụ thuộc vòng tròn
    PaymentModule,
    VoucherModule,
  ],
  providers: [RentService],
  controllers: [RentController],
  exports: [RentService],
})
export class RentModule { }
