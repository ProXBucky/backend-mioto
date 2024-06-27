import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AddressModule } from '../address/address.module';
import { LicenseModule } from '../license/license.module';
import { ReportModule } from '../report/report.module';
import { ReviewModule } from '../review/review.module';
import { LikeModule } from '../like/like.module';
import { CarModule } from '../car/car.module';
import { RentModule } from '../rent/rent.module';
import { VoucherModule } from '../voucher/voucher.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AddressModule, LicenseModule, ReportModule, ReviewModule, LikeModule,
    CarModule, RentModule, VoucherModule],
  providers: [UserService, CloudinaryService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule]
})
export class UserModule { }
