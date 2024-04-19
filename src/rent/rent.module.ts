import { Module } from '@nestjs/common';
import { RentService } from './rent/rent.service';
import { VoucherService } from './voucher/voucher.service';
import { PaymentService } from './payment/payment.service';
import { RentController } from './rent/rent.controller';
import { VoucherController } from './voucher/voucher.controller';
import { PaymentController } from './payment/payment.controller';

@Module({
  providers: [RentService, VoucherService, PaymentService],
  controllers: [RentController, VoucherController, PaymentController]
})
export class RentModule {}
