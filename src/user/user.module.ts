import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { AddressService } from './address/address.service';
import { LicenseService } from './license/license.service';
import { UserController } from './user/user.controller';
import { AddressController } from './address/address.controller';
import { LicenseController } from './license/license.controller';

@Module({
  providers: [UserService, AddressService, LicenseService],
  controllers: [UserController, AddressController, LicenseController]
})
export class UserModule {}
