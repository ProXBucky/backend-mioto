import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { Voucher } from './voucher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
    imports: [TypeOrmModule.forFeature([Voucher])],
    providers: [VoucherService],
    controllers: [VoucherController]
})
export class VoucherModule { }
