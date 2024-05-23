import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { Voucher } from './voucher.entity';
import { CreateNewVoucherDTO } from './dto/CreateNewVoucherDTO.dto';

@Controller('voucher')
export class VoucherController {
    constructor(private readonly voucherService: VoucherService) { }

    @Post()
    createNewVoucher(@Body() body: CreateNewVoucherDTO): Promise<Voucher> {
        try {
            return this.voucherService.createNewVoucher(body)
        } catch (e) {
            console.log(e)
            throw new HttpException('Create voucher fail', HttpStatus.BAD_REQUEST)
        }

    }

    @Get("/:userId")
    getAllVoucherByUserId(@Param('userId') userId: number): Promise<Voucher[]> {
        try {
            return this.voucherService.getAllVoucherByUserId(userId)
        }
        catch (e) {
            console.log(e)
            throw new HttpException('Get all voucher fail', HttpStatus.BAD_REQUEST)
        }
    }
}
