import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { AddressService } from './address.service';
import { UserAddress } from './address.entity';

@Controller('address')
export class AddressController {
    constructor(
        private readonly addressService: AddressService
    ) { }

    @Get("/:userId")
    getAllAddressById(@Param('userId') userId: number): Promise<UserAddress[]> {
        try {
            return this.addressService.getAllAddressById(userId)
        } catch (e) {
            console.log(e)
            throw new HttpException('Find addresses fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Post("/:userId")
    postAddress(@Param('userId') userId: number, @Body() data: UserAddress): Promise<UserAddress> {
        try {
            return this.addressService.postAddress(userId, data)
        } catch (e) {
            console.log(e)
            throw new HttpException('Post address fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Delete("/:addressId")
    deleteAddress(@Param('addressId') addressId: number): Promise<UserAddress> {
        try {
            return this.addressService.deleteAddress(addressId)
        } catch (e) {
            console.log(e)
            throw new HttpException('Delete address fail', HttpStatus.BAD_REQUEST)
        }
    }

}
