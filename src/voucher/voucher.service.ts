import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './voucher.entity';
import { Not, Repository } from 'typeorm';
import { CreateNewVoucherDTO } from './dto/CreateNewVoucherDTO.dto';
import { User } from '../user/user.entity';
import { VoucherOwner } from './voucherOwner.entity';

@Injectable()
export class VoucherService {
    constructor(
        @InjectRepository(Voucher)
        private readonly voucherRepo: Repository<Voucher>,

        @InjectRepository(VoucherOwner)
        private readonly voucherOwnerRepo: Repository<VoucherOwner>
    ) { }

    async countVoucher() {
        return await this.voucherRepo.count()
    }

    async createNewVoucher(body: CreateNewVoucherDTO): Promise<Voucher> {
        if (!body.voucherCode || !body.type || !body.expireDate || !body.discountPercent || !body.description) {
            throw new HttpException('Missing parameter', HttpStatus.BAD_REQUEST)
        }
        let newVoucher = new Voucher
        newVoucher.voucherCode = body.voucherCode
        newVoucher.description = body.description
        newVoucher.type = body.type
        newVoucher.expireDate = body.expireDate
        newVoucher.discountPercent = body.discountPercent
        newVoucher.status = "Active"
        return await this.voucherRepo.save(newVoucher)
    }

    async getAllVoucher(): Promise<Voucher[]> {
        let allVoucher = await this.voucherRepo.find({
            where: {
                status: "Active"
            },
            order: {
                expireDate: 'ASC'
            },
        })
        if (!allVoucher || allVoucher.length == 0) {
            throw new HttpException('You havenot voucher', HttpStatus.NO_CONTENT)
        }
        return allVoucher
    }

    async deleteVoucherByID(voucherId: number): Promise<Voucher> {
        let voucher = await this.voucherRepo.findOne({
            where: { voucherId: voucherId }
        })
        if (!voucher) {
            throw new HttpException("Voucher not found", HttpStatus.NOT_FOUND)
        }
        let voucherFind = await this.voucherOwnerRepo.find({ where: { voucher: { voucherId: voucher.voucherId } } })
        voucherFind.forEach(voucherOwn => {
            voucherOwn.status = "Inactive";
        });
        await this.voucherOwnerRepo.save(voucherFind)
        voucher.status = "Inactive"
        return await this.voucherRepo.save(voucher)
    }

    async getAllVoucherByUserId(userId: number): Promise<VoucherOwner[]> {
        let allVoucher = await this.voucherOwnerRepo.find({
            where: {
                user: { userId: userId },
                status: Not("Inactive")
            },
            relations: ['voucher']
        })
        if (!allVoucher || allVoucher.length == 0) {
            throw new HttpException('You havenot voucher', HttpStatus.NO_CONTENT)
        }
        return allVoucher
    }

    async useVoucher(voucherOwnerId: number): Promise<VoucherOwner> {
        let voucher = await this.voucherOwnerRepo.findOne({
            where: { voucherOwnerId: voucherOwnerId }
        })
        if (!voucher) {
            throw new HttpException('You havenot voucher with this id', HttpStatus.NO_CONTENT)
        }
        voucher.status = "Used"
        return await this.voucherOwnerRepo.save(voucher)
    }


    async feedVoucherToUser(voucherId: number, userIdArray: number[]): Promise<VoucherOwner[]> {
        const voucherOwners: VoucherOwner[] = [];
        const promises = userIdArray.map(async (userId) => {
            const voucherOwner = new VoucherOwner();
            const user = new User();
            user.userId = userId;
            voucherOwner.user = user;

            const voucher = new Voucher();
            voucher.voucherId = voucherId;
            voucherOwner.voucher = voucher;

            voucherOwner.status = "NotUsed";

            voucherOwners.push(voucherOwner);
            await this.voucherOwnerRepo.save(voucherOwner);
        });
        await Promise.all(promises);

        return voucherOwners;
    }

    async deleteVoucherOwnByUserId(userId: number): Promise<VoucherOwner[]> {
        let voucherFind = await this.voucherOwnerRepo.find({ where: { user: { userId: userId } } })
        return await this.voucherOwnerRepo.remove(voucherFind)
    }




}
