import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { Rent } from './rent.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModule } from '../payment/payment.module';
import { VoucherModule } from '../voucher/voucher.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rent]), PaymentModule, VoucherModule],
  providers: [RentService],
  controllers: [RentController],
  exports: [RentService]
})
export class RentModule { }
