import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rent } from './rent.entity';
import { In, LessThan, LessThanOrEqual, Like, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { CreateNewRentDTO } from './dto/CreateNewRentDTO.dto';
import { PaymentService } from '../payment/payment.service';
import { User } from '../user/user.entity';
import { Car } from '../car/car.entity';
import { VoucherService } from '../voucher/voucher.service';
import { VoucherOwner } from '../voucher/voucherOwner.entity';
import { CarService } from '../car/car.service';


@Injectable()
export class RentService {
    constructor(
        @InjectRepository(Rent)
        private readonly rentRepo: Repository<Rent>,
        @Inject(forwardRef(() => CarService))
        private readonly carService: CarService,
        private readonly paymentService: PaymentService,
        private readonly voucherService: VoucherService,


    ) { }

    // Nửa đêm sẽ update
    async updateRentStatus() {
        const today = new Date()
        const rents = await this.rentRepo.find({
            where: {
                rentStatus: 'ready',
                rentBeginDate: LessThanOrEqual(today)
            },
        });

        for (const rent of rents) {
            rent.rentStatus = 'ongoing';
            await this.rentRepo.save(rent);
        }
    }

    async updateRentStatusCancel() {
        const today = new Date()
        const rents = await this.rentRepo.find({
            where: {
                rentStatus: 'pending',
                rentBeginDate: LessThan(today)
            },
        });

        for (const rent of rents) {
            rent.rentStatus = 'cancel';
            await this.rentRepo.save(rent);
        }
    }

    async updateRentStatusFinish() {
        const today = new Date()
        const rents = await this.rentRepo.find({
            where: {
                rentStatus: 'ongoing',
                rentEndDate: LessThanOrEqual(today),
            },
        });

        for (const rent of rents) {
            rent.rentStatus = 'finish';
            await this.rentRepo.save(rent);
        }
    }

    async countRent() {
        return await this.rentRepo.count()
    }

    async getRentCountByBrand(): Promise<{ countRent: number[] }> {
        const cars = await this.carService.getCarCountByBrand()
        const brands = (cars).brand.map(item => item);

        const rents = await this.rentRepo
            .createQueryBuilder("rent")
            .leftJoin("rent.car", "car")
            .select("car.brand", "brand")
            .addSelect("COUNT(rent.rentId)", "count")
            .groupBy("car.brand")
            .getRawMany();

        const counts = brands.map(brand => {
            const rentRecord = rents.find(item => item.brand === brand);
            return rentRecord ? parseInt(rentRecord.count) : 0;
        });
        return {
            countRent: counts
        }
    }


    async getRentStatusCounts(): Promise<number[]> {
        const pendingCount = await this.rentRepo.count({ where: { rentStatus: 'pending' } });
        const readyCount = await this.rentRepo.count({ where: { rentStatus: 'ready' } });
        const ongoingCount = await this.rentRepo.count({ where: { rentStatus: 'ongoing' } });
        const cancelCount = await this.rentRepo.count({ where: { rentStatus: 'cancel' } });
        const finishCount = await this.rentRepo.count({ where: { rentStatus: 'finish' } });

        return [pendingCount, readyCount, ongoingCount, cancelCount, finishCount];
    }

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
            const voucher = { voucherOwnerId: body.voucherId } as VoucherOwner;
            rent.voucherOwner = voucher;
        }
        if (body.voucherId === 0) {
            rent.voucherOwner = null
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

    async deleteRent(rentId: number): Promise<Rent> {
        let rent = await this.rentRepo.findOne({
            where: { rentId: rentId }
        })
        if (!rent) {
            throw new HttpException("Rent not found", HttpStatus.NO_CONTENT)
        }
        await this.paymentService.deletePayment(rentId)
        return await this.rentRepo.remove(rent)
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
                relations: ['user', 'car', 'car.images', 'car.user', 'payment', 'voucherOwner.voucher']
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
                order: {
                    car: {
                        images: {
                            imageId: 'ASC'
                        }
                    }
                },
                relations: ['user', 'car', 'car.images', 'payment']
            });
            if (!allTrip || allTrip.length === 0) {
                allTrip = []
            }
            const processedTrips = await
                Promise.all(allTrip.map(async trip => {
                    if (trip.car.images && trip.car.images.length > 0) {
                        trip.car.images = [trip.car.images[0]];
                    }
                    delete trip.user.password;
                    return {
                        rentId: trip.rentId,
                        rentBeginDate: trip.rentBeginDate,
                        rentEndDate: trip.rentEndDate,
                        rentDays: trip.rentDays,
                        rentStatus: trip.rentStatus,
                        user: trip.user,
                        car: trip.car,
                        payment: trip.payment,
                        voucherOwner: trip.voucherOwner
                    };
                }));
            return processedTrips;
        }
        catch (error) {
            console.error('Error creating new rent:', error);
            throw new HttpException('Error creating new rent', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllOrderByUserId(userId: number): Promise<Rent[]> {
        try {
            let allTrip = await this.rentRepo.find({
                relations: ['user', 'car', 'car.images', 'payment'],
                where: {
                    car: { user: { userId: userId } }
                },
                order: {
                    car: {
                        images: {
                            imageId: 'ASC'
                        }
                    }
                }
            });
            if (!allTrip || allTrip.length === 0) {
                allTrip = []
            }
            const processedTrips = await
                Promise.all(allTrip.map(async trip => {
                    if (trip.car.images && trip.car.images.length > 0) {
                        trip.car.images = [trip.car.images[0]];
                    }
                    delete trip.user.password;
                    return {
                        rentId: trip.rentId,
                        rentBeginDate: trip.rentBeginDate,
                        rentEndDate: trip.rentEndDate,
                        rentDays: trip.rentDays,
                        rentStatus: trip.rentStatus,
                        user: trip.user,
                        car: trip.car,
                        payment: trip.payment,
                        voucherOwner: trip.voucherOwner
                    };
                }));
            return processedTrips;
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
                relations: ['voucherOwner.voucher']
            });
            if (!trip) {
                throw new HttpException('Trip not found', HttpStatus.NO_CONTENT)
            }
            if (trip.rentStatus === "ongoing") {
                throw new HttpException('Trip is ongoing', HttpStatus.CONFLICT)
            }
            trip.rentStatus = 'cancel'
            return await this.rentRepo.save(trip)
        }
        catch (error) {
            console.error('Error cancel new rent:', error);
            if (error instanceof HttpException) {
                throw error; // Re-throw HttpException as is
            }
            throw new HttpException('Error cancel new rent', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async acceptRentByRentId(rentId: number): Promise<Rent> {
        try {
            let trip = await this.rentRepo.findOne({
                where: { rentId: rentId }
            });
            if (!trip) {
                throw new HttpException('Trip not found', HttpStatus.NO_CONTENT)
            }
            trip.rentStatus = 'ready'
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
            return rent.rentStatus !== 'finish' &&
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
                    relations: ['car.images', 'user', 'car', 'car.user', 'payment', 'voucherOwner.voucher'],
                    where: {
                        rentStatus: Not(In(['cancel', 'finish']))
                    },
                    order: {
                        rentBeginDate: 'DESC',
                        car: {
                            images: {
                                imageId: 'ASC'
                            }
                        }
                    }
                });
            }
            else {
                trips = await this.rentRepo.find({
                    relations: ['car.images', 'user', 'car', 'car.user', 'payment', 'voucherOwner.voucher'],
                    where: {
                        car: {
                            location: Like(`%${city}%`)
                        },
                        rentStatus: Not(In(['cancel', 'finish']))
                    },
                    order: {
                        rentBeginDate: 'DESC',
                        car: {
                            images: {
                                imageId: 'ASC'
                            }
                        }
                    }
                });
            }
            if (!trips || trips.length === 0) {
                return trips
            }
            const processedTrips = await
                Promise.all(trips.map(async trip => {
                    if (trip.car.images && trip.car.images.length > 0) {
                        trip.car.images = [trip.car.images[0]];
                    }
                    delete trip.user.password;
                    delete trip.car.user.password;
                    return {
                        rentId: trip.rentId,
                        rentBeginDate: trip.rentBeginDate,
                        rentEndDate: trip.rentEndDate,
                        rentDays: trip.rentDays,
                        rentStatus: trip.rentStatus,
                        user: trip.user,
                        car: trip.car,
                        payment: trip.payment,
                        voucherOwner: trip.voucherOwner
                    };
                }));
            return processedTrips;
        }
        catch (e) {
            console.log(e);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async getAllTripFinishedByCity(city: string): Promise<Rent[]> {
        try {
            let trips = []
            if (city === "tatCa") {
                trips = await this.rentRepo.find({
                    relations: ['car.images', 'user', 'car', 'car.user', 'payment', 'voucherOwner.voucher'],
                    where: {
                        rentStatus: Not(In(['pending', 'ongoing', 'ready']))
                    },
                    order: {
                        rentBeginDate: 'DESC',
                        car: {
                            images: {
                                imageId: 'ASC'
                            }
                        },
                    }
                });
            }
            else {
                trips = await this.rentRepo.find({
                    relations: ['car.images', 'user', 'car', 'car.user', 'payment', 'voucherOwner.voucher'],
                    where: {
                        car: {
                            location: Like(`%${city}%`)
                        },
                        rentStatus: Not(In(['pending', 'ongoing', 'ready']))
                    },
                    order: {
                        rentBeginDate: 'DESC',
                        car: {
                            images: {
                                imageId: 'ASC'
                            }
                        },
                    }
                });
            }
            if (!trips || trips.length === 0) {
                return trips
            }
            const processedTrips = await
                Promise.all(trips.map(async trip => {
                    if (trip.car.images && trip.car.images.length > 0) {
                        trip.car.images = [trip.car.images[0]];
                    }
                    delete trip.user.password;
                    delete trip.car.user.password;
                    return {
                        rentId: trip.rentId,
                        rentBeginDate: trip.rentBeginDate,
                        rentEndDate: trip.rentEndDate,
                        rentDays: trip.rentDays,
                        rentStatus: trip.rentStatus,
                        user: trip.user,
                        car: trip.car,
                        payment: trip.payment,
                        voucherOwner: trip.voucherOwner
                    };
                }));
            return processedTrips;
        }
        catch (e) {
            console.log(e);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteRentByCarId(carId: number): Promise<Rent[]> {
        let rents = await this.rentRepo.find({
            where: { car: { carId: carId } }
        })
        if (!rents) {
            throw new HttpException('Rent not found', HttpStatus.NO_CONTENT)
        }
        return await this.rentRepo.remove(rents)
    }

    async deleteRentByUserId(userId: number): Promise<Rent[]> {
        let rents = await this.rentRepo.find({
            where: { user: { userId: userId } }
        })
        return await this.rentRepo.remove(rents)
    }

    async countRentOfUserId(userId: number): Promise<number> {
        let cnt = await this.rentRepo.count({
            where: { user: { userId: userId } }
        })
        return cnt
    }

    async statisticIncome(): Promise<{ labels: string[], data: number[] }> {
        try {
            const rents = await this.rentRepo.find({
                where: { rentStatus: 'finish' },
                relations: ['payment'],
            });

            const incomeMap: { [key: string]: number } = {};

            rents.forEach(rent => {
                const rentBeginDate = new Date(rent.rentBeginDate);
                const monthYear = rentBeginDate.toISOString().substring(0, 7); // Chuyển đổi về định dạng YYYY-MM
                const totalIncome = rent.payment ? rent.payment.paymentAmount : 0;

                if (incomeMap[monthYear]) {
                    incomeMap[monthYear] += totalIncome;
                } else {
                    incomeMap[monthYear] = totalIncome;
                }
            });

            const labels = Object.keys(incomeMap).sort().map(label => {
                const [year, month] = label.split('-');
                return `${month}/${year}`;
            });
            const data = labels.map(label => {
                const [month, year] = label.split('/');
                return incomeMap[`${year}-${month}`];
            });

            return { labels, data };
        } catch (error) {
            console.error('Error fetching income by month:', error);
            throw new InternalServerErrorException('Failed to fetch income by month');
        }
    }



}
