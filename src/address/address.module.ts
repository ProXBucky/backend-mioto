import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { UserAddress } from './address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
    imports: [TypeOrmModule.forFeature([UserAddress])],
    providers: [AddressService],
    controllers: [AddressController],
    exports: [AddressService]
})
export class AddressModule { }
