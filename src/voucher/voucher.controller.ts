import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { Voucher } from './voucher.entity';
import { CreateNewVoucherDTO } from './dto/CreateNewVoucherDTO.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { VoucherOwner } from './voucherOwner.entity';

@Controller('voucher')
export class VoucherController {
    constructor(private readonly voucherService: VoucherService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Staff', 'Admin')
    createNewVoucher(@Body() body: CreateNewVoucherDTO): Promise<Voucher> {
        try {
            return this.voucherService.createNewVoucher(body)
        } catch (e) {
            console.log(e)
            throw new HttpException('Create voucher fail', HttpStatus.BAD_REQUEST)
        }

    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Staff', 'Admin')
    getAllVoucher(): Promise<Voucher[]> {
        try {
            return this.voucherService.getAllVoucher()
        }
        catch (e) {
            console.log(e)
            throw new HttpException('Get all voucher fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Put("/:voucherId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Staff', 'Admin')
    deleteVoucherByID(@Param("voucherId") voucherId: number): Promise<Voucher> {
        try {
            return this.voucherService.deleteVoucherByID(voucherId)
        }
        catch (e) {
            console.log(e)
            throw new HttpException('Get all voucher fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Get("/:userId")
    @UseGuards(JwtAuthGuard)
    getAllVoucherByUserId(@Param('userId') userId: number): Promise<VoucherOwner[]> {
        try {
            return this.voucherService.getAllVoucherByUserId(userId)
        }
        catch (e) {
            console.log(e)
            throw new HttpException('Get all voucher fail', HttpStatus.BAD_REQUEST)
        }
    }


    @Post("feed-voucher/:voucherId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Staff', 'Admin')
    async feedVoucherToUser(@Param("voucherId") voucherId: number, @Body() body: { userIdArray: number[] }): Promise<VoucherOwner[]> {
        const { userIdArray } = body;
        if (!Array.isArray(userIdArray) || userIdArray.length === 0 || !userIdArray.every(Number.isInteger)) {
            throw new HttpException('Invalid input data. Expecting an array of numbers.', HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.voucherService.feedVoucherToUser(voucherId, userIdArray);
        } catch (e) {
            console.log(e);
            throw new HttpException('Create voucher fail', HttpStatus.BAD_REQUEST);
        }
    }
}
