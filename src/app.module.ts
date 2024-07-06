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
import { User } from './user/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryController } from './cloudinary/cloudinary.controller';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { CarHasFeature } from './carHasFeature/carHasFeature.entity';
import { CarHasFeatureModule } from './carHasFeature/carHasFeature.module';
import { VoucherOwner } from './voucher/voucherOwner.entity';
import { BlogModule } from './blog/blog.module';
import { Blog } from './blog/blog.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, EMAIL_PASSWORD, EMAIL_USER } from './config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';


@Module({
  imports: [AddressModule, AdminModule, CarModule, ImageModule, FeatureModule, LicenseModule, LikeModule, CarHasFeatureModule,
    PaymentModule, RentModule, ReportModule, ReviewModule, UserModule, VoucherModule, CloudinaryModule, AuthModule,
    BlogModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [Admin, Car, Feature, CarImage, Payment, Rent, Review, Voucher, Report, Like, UserAddress,
        UserLicense, User, CarHasFeature, VoucherOwner, Blog],
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // SMTP host của nhà cung cấp email của bạn
        port: 587, // Cổng SMTP của nhà cung cấp email của bạn
        secure: false, // true cho 465, false cho các cổng khác
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASSWORD, // Mật khẩu ứng dụng bạn vừa tạo
        },
      },
      defaults: {
        from: '"No Reply" <mioto-nest@gmail.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // hoặc Pug, EJS, v.v.
        options: {
          strict: true,
        },
      },
    }),
    MulterModule.register({
      dest: './upload',
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
    BlogModule
  ],
  controllers: [AppController, CloudinaryController],
  providers: [AppService, CloudinaryService],
})
export class AppModule { }
