import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from './payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
    imports: [TypeOrmModule.forFeature([Payment])],
    providers: [PaymentService],
    controllers: [],
    exports: [PaymentService]
})
export class PaymentModule { }
