import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CarModule } from './car/car.module';
import { ReviewModule } from './review/review.module';
import { RentModule } from './rent/rent.module';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin/admin/admin.entity';
import { Car } from './car/car/car.entity';
import { Feature } from './car/feature/feature.entity';
import { CarImage } from './car/image/image.entity';
import { Payment } from './rent/payment/payment.entity';
import { Rent } from './rent/rent/rent.entity';
import { Review } from './review/review/review.entity';
import { Voucher } from './rent/voucher/voucher.entity';
import { Report } from './review/report/report.entity';
import { Like } from './review/like/like.entity';
import { UserAddress } from './user/address/address.entity';
import { UserLicense } from './user/license/license.entity';
import { CarOwner } from './user/owner/owner.entity';
import { User } from './user/user/user.entity';

@Module({
  imports: [UserModule, CarModule, ReviewModule, RentModule, AdminModule,
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
