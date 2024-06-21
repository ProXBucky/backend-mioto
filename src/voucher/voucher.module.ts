import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { Voucher } from './voucher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherOwner } from './voucherOwner.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Voucher, VoucherOwner])],
    providers: [VoucherService],
    controllers: [VoucherController],
    exports: [VoucherService]
})
export class VoucherModule { }
