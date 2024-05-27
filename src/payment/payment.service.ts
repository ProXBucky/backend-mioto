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
        payment.paymentStatus = "pending"
        payment.paymentDate = new Date()
        payment.rent = rent

        return await this.paymentRepo.save(payment)
    }
}
