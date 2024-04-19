import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from './address/address.module';
import { AdminModule } from './admin/admin.module';
import { CarModule } from './car/car.module';
import { ImageModule } from './carImage/image.module';
import { FeatureModule } from './feature/feature.module';
import { LicenseModule } from './license/license.module';
import { LikeModule } from './like/like.module';
import { OwnerModule } from './owner/owner.module';
import { PaymentModule } from './payment/payment.module';
import { RentModule } from './rent/rent.module';
import { ReportModule } from './report/report.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import { VoucherModule } from './voucher/voucher.module';
import { Admin } from './admin/admin.entity';
import { Car } from './car/car.entity';
import { Feature } from './feature/feature.entity';
import { CarImage } from './carImage/image.entity';
import { Payment } from './payment/payment.entity';
import { Rent } from './rent/rent.entity';
import { Review } from './review/review.entity';
import { Voucher } from './voucher/voucher.entity';
import { Report } from './report/report.entity';
import { Like } from './like/like.entity';
import { UserAddress } from './address/address.entity';
import { UserLicense } from './license/license.entity';
import { CarOwner } from './owner/owner.entity';
import { User } from './user/user.entity';



@Module({
  imports: [AddressModule, AdminModule, CarModule, ImageModule, FeatureModule, LicenseModule, LikeModule,
    OwnerModule, PaymentModule, RentModule, ReportModule, ReviewModule, UserModule, VoucherModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'miotoDB',
      entities: [Admin, Car, Feature, CarImage, Payment, Rent, Review, Voucher, Report, Like, UserAddress, UserLicense, CarOwner, User],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
