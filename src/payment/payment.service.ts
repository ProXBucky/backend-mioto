import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Payment } from './payment.entity';
import { Rent } from '../rent/rent.entity';
import { CreateNewPaymentDTO } from './dto/CreateNewPaymentDTO.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepo: Repository<Payment>
    ) { }

    async createNewPayment(body: CreateNewPaymentDTO): Promise<Payment> {
        if (!body.rentId) {
            throw new HttpException('Missing parameter', HttpStatus.BAD_REQUEST)
        }
        let rent = new Rent
        rent.rentId = body.rentId

        let payment = new Payment
        payment.paymentAmount = body.paymentAmount
        payment.voucherAmount = body.voucherAmount
        payment.paymentDate = new Date()
        payment.rent = rent

        return await this.paymentRepo.save(payment)
    }

    async deletePayment(rentId: number): Promise<Payment> {
        let payment = await this.paymentRepo.findOne({
            where: { rent: { rentId: rentId } }
        })
        if (!payment) {
            throw new HttpException("Payment not found", HttpStatus.NOT_FOUND)
        }
        return await this.paymentRepo.remove(payment)
    }
}
