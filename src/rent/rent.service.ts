import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rent } from './rent.entity';
import { In, Like, Not, Repository } from 'typeorm';
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

    convertToDate(dateString: string): Date {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date
    }

    async checkStatusRent(carId: number, beginDate: string, endDate: string): Promise<boolean> {
        const rents = await this.rentRepo.find({
            where: { car: { carId: carId } },
        });

        const checkStartDate = this.convertToDate(beginDate);
        const checkEndDate = this.convertToDate(endDate);

        if (!rents || rents.length === 0) {
            return true; // Không có lịch thuê nào, có thể đặt
        }

        // Kiểm tra trùng lặp thời gian
        const isOverlap = rents.some(rent => {
            return rent.rentStatus !== 'completed' &&
                rent.rentStatus !== 'cancel' &&
                new Date(rent.rentBeginDate) < checkEndDate &&
                new Date(rent.rentEndDate) > checkStartDate;
        });

        return !isOverlap; // Trả về true nếu không trùng lặp, false nếu trùng lặp
    }

    async getAllTripPendingByCity(city: string): Promise<Rent[]> {
        try {
            let trips = []
            if (city === "tatCa") {
                trips = await this.rentRepo.find({
                    where: {
                        rentStatus: Not(In(['cancel', 'finish']))
                    },
                    relations: ['user', 'car', 'car.images', 'car.owners.user', 'payment'],
                });
            }
            else {
                trips = await this.rentRepo.find({
                    where: {
                        car: {
                            location: Like(`%${city}%`)
                        },
                        rentStatus: Not(In(['cancel', 'finish']))
                    },
                    relations: ['user', 'car', 'car.images', 'car.owners.user', 'payment'],
                });
            }
            if (!trips || trips.length === 0) {
                return trips
            }
            trips = trips.map(async trip => {
                if (trip.car.images && trip.car.images.length > 0) {
                    trip.car.images = [trip.car.images[0]];
                }
                delete trip.user.password
                delete trip.car.owners.user.password
                return {
                    rentId: trip.rentId,
                    rentBeginDate: trip.rentBeginDate,
                    rentEndDate: trip.rentEndDate,
                    rentDays: trip.rentDays,
                    rentStatus: trip.rentStatus,
                    user: trip.user,
                    car: trip.car,
                    payment: trip.payment,
                };
            });
            return Promise.all(trips);
        }
        catch (e) {
            console.log(e);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
