import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './voucher.entity';
import { Repository } from 'typeorm';
import { CreateNewVoucherDTO } from './dto/CreateNewVoucherDTO.dto';
import { User } from '../user/user.entity';

@Injectable()
export class VoucherService {
    constructor(
        @InjectRepository(Voucher)
        private readonly voucherRepo: Repository<Voucher>
    ) { }

    async createNewVoucher(body: CreateNewVoucherDTO): Promise<Voucher> {
        if (!body.voucherCode || !body.userId || !body.type || !body.expireDate || !body.discountPercent || !body.description) {
            throw new HttpException('Missing parameter', HttpStatus.BAD_REQUEST)
        }
        let user = new User
        user.userId = body.userId

        let newVoucher = new Voucher
        newVoucher.voucherCode = body.voucherCode
        newVoucher.description = body.description
        newVoucher.type = body.type
        newVoucher.status = "NotUsed"
        newVoucher.expireDate = body.expireDate
        newVoucher.discountPercent = body.discountPercent
        newVoucher.user = user

        return await this.voucherRepo.save(newVoucher)
    }

    async getAllVoucherByUserId(userId: number): Promise<Voucher[]> {
        let allVoucher = await this.voucherRepo.find({
            where: { user: { userId: userId } },
            order: {
                expireDate: 'ASC'
            },
        })
        if (!allVoucher || allVoucher.length == 0) {
            throw new HttpException('You havenot voucher', HttpStatus.NO_CONTENT)
        }
        return allVoucher
    }




}
