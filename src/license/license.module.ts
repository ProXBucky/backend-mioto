import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { UserLicense } from './license.entity';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
    imports: [TypeOrmModule.forFeature([UserLicense])],
    providers: [LicenseService],
    controllers: [LicenseController]
})
export class LicenseModule { }
