import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { UserLicense } from './license.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';



@Module({
    imports: [TypeOrmModule.forFeature([UserLicense])],
    providers: [LicenseService, CloudinaryService],
    controllers: [LicenseController],
    exports: [LicenseService]
})
export class LicenseModule { }
