import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rent } from './rent.entity';
import { Like, Not, Repository } from 'typeorm';
import { CreateNewRentDTO } from './dto/CreateNewRentDTO.dto';
import { PaymentService } from '../payment/payment.service';
import { User } from '../user/user.entity';
import { Car } from '../car/car.entity';
import { Voucher } from '../voucher/voucher.entity';
import { VoucherService } from '../voucher/voucher.service';


@Injectable()
export class RentService {
    constructor(
        @InjectRepository(Rent)
        private readonly rentRepo: Repository<Rent>,
        private readonly paymentService: PaymentService,
        private readonly voucherService: VoucherService
    ) { }

    async createNewRent(body: CreateNewRentDTO): Promise<Rent> {

        // Kiểm tra các tham số bắt buộc
        if (!body.rentBeginDate || !body.rentEndDate || !body.rentDays || !body.carId || !body.userId || body.paymentAmount === undefined || body.voucherAmount === undefined) {
            throw new HttpException('Missing parameter', HttpStatus.BAD_REQUEST);
        }

        const user = { userId: body.userId } as User;
        const car = { carId: body.carId } as Car;

        const rent = new Rent();
        rent.rentBeginDate = body.rentBeginDate;
        rent.rentEndDate = body.rentEndDate;
        rent.rentDays = body.rentDays;
        rent.user = user;
        rent.car = car;
        rent.rentStatus = 'pending';

        if (body.voucherId && body.voucherId !== 0) {
            const voucher = { voucherId: body.voucherId } as Voucher;
            rent.voucher = voucher;
        }
        if (body.voucherId === 0) {
            rent.voucher = null
        }
        try {
            const savedRent = await this.rentRepo.save(rent);
            if (savedRent) {
                if (body.voucherId && body.voucherId !== 0) {
                    await this.voucherService.useVoucher(body.voucherId);
                }

                await this.paymentService.createNewPayment({
                    paymentAmount: body.paymentAmount,
                    voucherAmount: body.voucherAmount,
                    rentId: savedRent.rentId
                });
            }
            else {
                throw new HttpException('Error system', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            return savedRent;
        }
        catch (error) {
            console.error('Error creating new rent:', error);
            throw new HttpException('Error creating new rent', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async countTripByCarId(carId: number): Promise<{ tripCount: number }> {
        try {
            let tripCnt = 0
            tripCnt = await this.rentRepo.count({
                where: {
                    car: { carId: carId }
                }
            });
            return {
                tripCount: tripCnt
            };
        }
        catch (error) {
            console.error('Error creating new rent:', error);
            throw new HttpException('Error creating new rent', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getTripByRentId(rentId: number): Promise<Rent> {
        try {
            let trip = await this.rentRepo.findOne({
                where: {
                    rentId: rentId
                },
                relations: ['user', 'car', 'car.images', 'car.owners.user', 'payment', 'voucher']
            });
            return trip
        }
        catch (error) {
            console.error('Error creating new rent:', error);
            throw new HttpException('Error creating new rent', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async getAllTripByUserId(userId: number): Promise<Rent[]> {
        try {
            let allTrip = await this.rentRepo.find({
                where: {
                    user: { userId: userId }
                },
                relations: ['user', 'car', 'car.images', 'car.owners.user', 'payment']
            });
            if (!allTrip || allTrip.length === 0) {
                allTrip = []
            }
            return allTrip
        }
        catch (error) {
            console.error('Error creating new rent:', error);
            throw new HttpException('Error creating new rent', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async cancelRentByRentId(rentId: number): Promise<Rent> {
        try {
            let trip = await this.rentRepo.findOne({
                where: { rentId: rentId },
                relations: ['voucher']
            });
            if (!trip) {
                throw new HttpException('Trip not found', HttpStatus.NO_CONTENT)
            }
            await this.voucherService.repayVoucher(trip.voucher.voucherId)
            trip.rentStatus = 'cancel'
            return await this.rentRepo.save(trip)
        }
        catch (error) {
            console.error('Error cancel new rent:', error);
            throw new HttpException('Error cancel new rent', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // async getAllTripByCity(city: string, userId: number): Promise<Car[]> {
    //     try {
    //         let trips = []
    //         if (userId !== 0) {
    //             trips = await this.rentRepo.find({
    //                 relations: ['car', 'car.owners', 'car.owners.user', 'car.images'], // Load các mối quan hệ để sử dụng trong điều kiện
    //                 where: {
    //                     car: {
    //                         location: Like(`%${city}%`),
    //                         status: Not("Approving"),
    //                         owners: {
    //                             user: {
    //                                 userId: Not(userId)
    //                             }
    //                         }
    //                     },
    //                 }
    //             });
    //         }
    //         else {
    //             trips = await this.rentRepo.find({
    //                 relations: ['car.images'], // Load các mối quan hệ để sử dụng trong điều kiện
    //                 where: {
    //                     car: {
    //                         location: Like(`%${city}%`),
    //                         status: Not("Approving"),
    //                     }
    //                 }
    //             });
    //         }
    //         if (!trips || trips.length === 0) {
    //             return trips
    //         }
    //         trips = trips.map(async trip => {
    //             if (trip.car.images && trip.car.images.length > 0) {
    //                 trip.car.images = [trip.car.images[0]];
    //             }

    //             // let stats = await this.carService.statisticCar(trip.car.carId)
    //             return {
    //                 car: trip.car,
    //                 // stats: {
    //                 //     star: stats.star,
    //                 //     tripCount: stats.tripCount,
    //                 //     reviewCount: stats.reviewCount,
    //                 // }
    //             };
    //         });
    //         return Promise.all(trips);
    //     }
    //     catch (e) {
    //         console.log(e);
    //         throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }
}
