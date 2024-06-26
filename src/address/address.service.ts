import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAddress } from './address.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(UserAddress)
        private readonly userAddressRepo: Repository<UserAddress>
    ) { }

    async getAllAddressById(userId: number): Promise<UserAddress[]> {
        return await this.userAddressRepo.find({ where: { user: { userId: userId } } })
    }

    async postAddress(userId: number, data: UserAddress): Promise<UserAddress> {
        let newAddress = new UserAddress
        newAddress.city = data.city
        newAddress.district = data.district
        if (data.ward) {
            newAddress.ward = data.ward
        }
        newAddress.streetAddress = data.streetAddress
        let user = new User();
        user.userId = userId;
        newAddress.user = user
        let response = await this.userAddressRepo.save(newAddress)
        return response

    }

    async deleteAddress(addressId: number): Promise<UserAddress> {
        let addressFind = await this.userAddressRepo.findOne({ where: { addressId: addressId } })
        if (!addressFind) {
            throw new HttpException('Address not found', HttpStatus.NOT_FOUND)
        }
        let response = await this.userAddressRepo.remove(addressFind)
        return response
    }


    async deleteAddressByUserId(userId: number): Promise<UserAddress[]> {
        let addressFind = await this.userAddressRepo.find({ where: { user: { userId: userId } } })
        return await this.userAddressRepo.remove(addressFind)
    }
}
