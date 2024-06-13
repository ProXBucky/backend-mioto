import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from './admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';


@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [AdminService, CloudinaryService],
  controllers: [AdminController],
  exports: [AdminService]
})
export class AdminModule { }
