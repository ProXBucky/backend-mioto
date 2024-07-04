import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { Car } from './car.entity';
import { RegisterNewCarDTO } from './dto/RegisterNewCarDTO.dto';
import { FeatureService } from '../feature/feature.service';
import { CarHasFeatureService } from '../carHasFeature/carHasFeature.service';
import { ImageService } from '../carImage/image.service';
import { EditCarDTO } from './dto/EditCarDTO.dto';
import { GetCarDTO } from './dto/GetCarDTO.dto';
import { plainToInstance } from 'class-transformer';
import { ReviewService } from '../review/review.service';
import { RentService } from '../rent/rent.service';
import { User } from '../user/user.entity';
import { ReportService } from '../report/report.service';
import { LikeService } from '../like/like.service';

@Injectable()
export class CarService {
    constructor(
        @InjectRepository(Car)
        private readonly carRepo: Repository<Car>,
        private readonly featureService: FeatureService,
        private readonly carHasFeatureService: CarHasFeatureService,
        private readonly carImageService: ImageService,
        private readonly reviewService: ReviewService,
        @Inject(forwardRef(() => RentService))
        private rentService: RentService,
        private readonly reportService: ReportService,
        private readonly likeService: LikeService
    ) { }

    async countCar() {
        return await this.carRepo.count()
    }

    async getCarCountByBrand(): Promise<{ brand: string[], count: number[] }> {
        const cars = await this.carRepo
            .createQueryBuilder("car")
            .select("car.brand", "brand")
            .addSelect("COUNT(car.carId)", "count")
            .groupBy("car.brand")
            .getRawMany();

        const brands = cars.map(item => item.brand);
        const counts = cars.map(item => parseInt(item.count));

        return { brand: brands, count: counts };
    }

    async getCarByUserId(userId: number): Promise<GetCarDTO[]> {
        let cars = await this.carRepo.find({
            where: { user: { userId: userId } },
            relations: ['images', 'carFeatures.feature', 'user'],
            order: {
                images: {
                    imageId: 'ASC'
                }
            }
        });
        if (!cars || cars.length === 0) {
            throw new HttpException('You havenot car', HttpStatus.NOT_FOUND);
        }
        return plainToInstance(GetCarDTO, cars);
    }

    async getCarByCarId(carId: number): Promise<GetCarDTO> {
        let cars = await this.carRepo.findOne({
            where: { carId: carId },
            relations: ['images', 'carFeatures.feature', 'user'],
            order: {
                images: {
                    imageId: 'ASC'
                }
            }
        });
        if (!cars) {
            throw new HttpException('You havenot car', HttpStatus.NOT_FOUND);
        }
        return plainToInstance(GetCarDTO, cars);
    }

    async statisticCar(carId: number): Promise<{ star: number, tripCount: number, reviewCount: number }> {
        const tripCountPromise = await this.rentService.countTripByCarId(carId)
        const allStarPromise = await this.reviewService.getReviewScore(carId)

        const [tripCount, allStar] = await Promise.all([tripCountPromise, allStarPromise]);

        return {
            star: (allStar).totalScoreReview,
            tripCount: (tripCount).tripCount,
            reviewCount: (allStar).reviewCount
        }
    }

    // async getAllCarByCity(city: string, userId: number, limit: number): Promise<Car[]> {
    //     try {
    //         let cars = []
    //         if (userId !== 0) {
    //             cars = await this.carRepo.find({
    //                 relations: ['user', 'images'], // Load các mối quan hệ để sử dụng trong điều kiện
    //                 order: {
    //                     images: {
    //                         imageId: 'ASC'
    //                     }
    //                 },
    //                 where: {
    //                     location: Like(`%${city}%`),
    //                     status: Not("Approving"),
    //                     user: {
    //                         userId: Not(userId)
    //                     }
    //                 },
    //                 take: limit
    //             });
    //         }
    //         else {
    //             cars = await this.carRepo.find({
    //                 relations: ['images', 'user'], // Load các mối quan hệ để sử dụng trong điều kiện
    //                 order: {
    //                     images: {
    //                         imageId: 'ASC'
    //                     }
    //                 },
    //                 where: {
    //                     location: Like(`%${city}%`),
    //                     status: Not("Approving"),
    //                 },
    //                 take: limit,
    //             });
    //         }
    //         if (!cars || cars.length === 0) {
    //             return cars
    //         }
    //         cars = cars.map(async car => {
    //             if (car.images && car.images.length > 0) {
    //                 car.images = [car.images[0]];
    //             }

    //             let stats = await this.statisticCar(car.carId);
    //             return {
    //                 ...car,
    //                 stats: {
    //                     star: stats.star,
    //                     tripCount: stats.tripCount,
    //                     reviewCount: stats.reviewCount,
    //                 }
    //             };
    //         });
    //         return Promise.all(cars);
    //     }
    //     catch (e) {
    //         console.log(e);
    //         throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    async getAllCarByCity(city: string, userId: number, limit: number): Promise<Car[]> {
        try {
            let cars = [];
            const whereConditions: any = {
                location: Like(`%${city}%`),
                status: Not("Approving")
            };

            if (userId !== 0) {
                whereConditions.user = { userId: Not(userId) };
            }

            // Lấy tất cả các bản ghi thỏa mãn điều kiện
            cars = await this.carRepo.find({
                relations: ['user', 'images'],
                order: {
                    images: {
                        imageId: 'ASC'
                    }
                },
                where: whereConditions
            });

            if (!cars || cars.length === 0) {
                return cars;
            }

            const carsWithStats = await Promise.all(cars.map(async car => {
                if (car.images && car.images.length > 0) {
                    car.images = [car.images[0]];
                }

                if (car.user) {
                    delete car.user.password;
                }

                let stats = await this.statisticCar(car.carId);
                return {
                    ...car,
                    stats: {
                        star: stats.star,
                        tripCount: stats.tripCount,
                        reviewCount: stats.reviewCount,
                    }
                };
            }));

            // Giới hạn số lượng bản ghi trả về theo giá trị limit
            return carsWithStats.slice(0, limit);
        } catch (e) {
            console.log(e);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllCarByCityByAdmin(city: string): Promise<Car[]> {
        try {
            let cars = []
            if (city === "tatCa") {
                cars = await this.carRepo.find({
                    relations: ['user', 'images'], // Load các mối quan hệ để sử dụng trong điều kiện
                    order: {
                        images: {
                            imageId: 'ASC'
                        }
                    }
                });
            }
            else {
                cars = await this.carRepo.find({
                    relations: ['images', 'user'], // Load các mối quan hệ để sử dụng trong điều kiện
                    order: {
                        images: {
                            imageId: 'ASC'
                        }
                    },
                    where: {
                        location: Like(`%${city}%`),
                    }
                });
            }
            if (!cars || cars.length === 0) {
                return cars
            }
            cars = cars.map(async car => {
                if (car.images && car.images.length > 0) {
                    car.images = [car.images[0]];
                }

                let stats = await this.statisticCar(car.carId);
                return {
                    ...car,
                    stats: {
                        star: stats.star,
                        tripCount: stats.tripCount,
                        reviewCount: stats.reviewCount,
                    }
                };
            });
            return Promise.all(cars);
        }
        catch (e) {
            console.log(e);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    async registerNewCar(userId: number, body: RegisterNewCarDTO): Promise<Car> {
        try {
            let newCar = new Car
            newCar.brand = body.brand
            newCar.model = body.model
            newCar.modelYear = body.modelYear
            newCar.capacity = body.capacity
            newCar.plateNumber = body.plateNumber
            newCar.transmission = body.transmission
            newCar.fuelType = body.fuelType
            newCar.mortgage = body.mortgage
            newCar.pricePerDay = body.pricePerDay
            newCar.description = body.description
            newCar.city = body.city
            newCar.location = body.location
            newCar.district = body.district
            newCar.ward = body.ward
            newCar.streetAddress = body.streetAddress
            newCar.status = "Approving"
            let user = new User
            user.userId = userId
            newCar.user = user
            let carReponse = await this.carRepo.save(newCar)

            if (carReponse && carReponse.carId) {
                try {
                    let featureIdArray = await this.featureService.convertArrFeatureCodetoArrFeatureId(body.arrayFeatureCode)
                    if (featureIdArray && featureIdArray.length > 0) {
                        try {
                            let res = await this.carHasFeatureService.createCarHaveFeature(carReponse.carId, featureIdArray)
                            if (!res) {
                                throw new HttpException('Create feature car Fail', HttpStatus.BAD_REQUEST)
                            }
                        } catch (err) {
                            console.log('2', err)
                        }
                    }
                } catch (e) {
                    console.log('3', e)
                }
            }

            if (carReponse && carReponse.carId) {
                try {
                    let res = await this.carImageService.postMultiImageCar(carReponse.carId, body.arrayImageCar)
                    if (!res) {
                        throw new HttpException('Create multi image car Fail', HttpStatus.BAD_REQUEST)
                    }
                } catch (e) {
                    console.log('4', e)
                }
            }

            return newCar
        } catch (err) {
            console.log('5', err)
        }
    }

    async registerNewCarByAdmin(userId: number, body: RegisterNewCarDTO): Promise<Car> {
        try {
            let newCar = new Car
            newCar.brand = body.brand
            newCar.model = body.model
            newCar.modelYear = body.modelYear
            newCar.capacity = body.capacity
            newCar.plateNumber = body.plateNumber
            newCar.transmission = body.transmission
            newCar.fuelType = body.fuelType
            newCar.mortgage = body.mortgage
            newCar.pricePerDay = body.pricePerDay
            newCar.description = body.description
            newCar.city = body.city
            newCar.location = body.location
            newCar.district = body.district
            newCar.ward = body.ward
            newCar.streetAddress = body.streetAddress
            newCar.status = "Approved"
            let user = new User
            user.userId = userId
            newCar.user = user
            let carReponse = await this.carRepo.save(newCar)

            if (carReponse && carReponse.carId) {
                try {
                    let featureIdArray = await this.featureService.convertArrFeatureCodetoArrFeatureId(body.arrayFeatureCode)
                    if (featureIdArray && featureIdArray.length > 0) {
                        try {
                            let res = await this.carHasFeatureService.createCarHaveFeature(carReponse.carId, featureIdArray)
                            if (!res) {
                                throw new HttpException('Create feature car Fail', HttpStatus.BAD_REQUEST)
                            }
                        } catch (err) {
                            console.log(err)
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
            }

            if (carReponse && carReponse.carId) {
                try {
                    let res = await this.carImageService.postMultiImageCar(carReponse.carId, body.arrayImageCar)
                    if (!res) {
                        throw new HttpException('Create multi image car Fail', HttpStatus.BAD_REQUEST)
                    }
                } catch (e) {
                    console.log(e)
                }
            }

            return newCar
        } catch (err) {
            console.log(err)
        }
    }

    async editInformationCar(carId: number, body: EditCarDTO): Promise<Car> {
        try {
            let carEdit = await this.carRepo.findOne({ where: { carId: carId } })
            if (!carEdit) {
                throw new HttpException('This car is not found', HttpStatus.NOT_FOUND)
            }
            if (carId && body.arrayImageCar) {
                try {
                    // Xoa cac anh cu
                    await this.carImageService.deleteAllCarImageByCarId(carId)
                    //Them cac anh moi
                    await this.carImageService.postMultiImageCar(carId, body.arrayImageCar)
                } catch (e) {
                    console.log('4', e)
                }
            }
            carEdit.plateNumber = body.plateNumber
            carEdit.mortgage = body.mortgage
            carEdit.pricePerDay = body.pricePerDay
            carEdit.streetAddress = body.streetAddress
            carEdit.ward = body.ward
            carEdit.district = body.district
            carEdit.city = body.city
            carEdit.location = body.location
            return await this.carRepo.save(carEdit)
        } catch (err) {
            console.log(err)
        }
    }

    async editInformationCarByAdmin(carId: number, body: EditCarDTO): Promise<Car> {
        try {
            let carEdit = await this.carRepo.findOne({ where: { carId: carId } })
            if (!carEdit) {
                throw new HttpException('This car is not found', HttpStatus.NOT_FOUND)
            }
            if (body.arrayImageCar && body.arrayImageCar.length > 0) {
                try {
                    // Xoa cac anh cu
                    await this.carImageService.deleteAllCarImageByCarId(carId)
                    //Them cac anh moi
                    await this.carImageService.postMultiImageCar(carId, body.arrayImageCar)
                } catch (e) {
                    console.log('4', e)
                }
            }
            carEdit.description = body.description
            carEdit.transmission = body.transmission
            carEdit.modelYear = body.modelYear
            carEdit.capacity = body.capacity
            carEdit.plateNumber = body.plateNumber
            carEdit.mortgage = body.mortgage
            carEdit.pricePerDay = body.pricePerDay
            carEdit.streetAddress = body.streetAddress
            carEdit.ward = body.ward
            carEdit.district = body.district
            carEdit.city = body.city
            carEdit.location = body.location
            return await this.carRepo.save(carEdit)
        } catch (err) {
            console.log(err)
        }
    }

    async deleteCarByCarId(carId: number): Promise<Car> {
        let car = await this.carRepo.findOne({
            where: { carId: carId }
        })
        if (!car) {
            throw new HttpException("Car not found", HttpStatus.NO_CONTENT)
        }
        await this.rentService.deleteRentByCarId(car.carId)
        await this.reportService.deleteReportByCarId(car.carId)
        await this.reviewService.deleteReviewByCarId(car.carId)
        await this.likeService.deleteLikeByCarId(car.carId)
        await this.carImageService.deleteAllCarImageByCarId(car.carId)
        await this.carHasFeatureService.deleteCarHasFeatureByCarId(car.carId)
        return await this.carRepo.remove(car)
    }

    async deleteCarsByUserId(userId: number): Promise<Car[]> {
        const cars = await this.carRepo.find({
            where: { user: { userId: userId } },
        });

        if (!cars || cars.length === 0) {
            throw new HttpException('Car not found', HttpStatus.NO_CONTENT);
        }

        for (const car of cars) {
            await this.rentService.deleteRentByCarId(car.carId);
            await this.reportService.deleteReportByCarId(car.carId);
            await this.reviewService.deleteReviewByCarId(car.carId);
            await this.likeService.deleteLikeByCarId(car.carId);
            await this.carImageService.deleteAllCarImageByCarId(car.carId);
            await this.carHasFeatureService.deleteCarHasFeatureByCarId(car.carId);
        }

        return await this.carRepo.remove(cars);
    }

    convertToDate(dateString: string): Date {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    }


    async findAllCar(query: any): Promise<Car[]> {
        try {
            const { city, userId, beginDate, endDate, brand, transmission, fuelType, limit } = query;
            let cars: Car[] = [];
            const checkStartDate = this.convertToDate(beginDate);
            const checkEndDate = this.convertToDate(endDate);

            const whereConditions: any = {
                location: Like(`%${city}%`),
                status: Not("Approving"),
            };

            if (transmission && transmission !== "Tất cả") {
                whereConditions.transmission = Like(`%${transmission}%`);
            }

            if (brand && brand !== "Tất cả") {
                whereConditions.brand = Like(`%${brand}%`)
            }
            if (fuelType && fuelType !== "Tất cả") {
                whereConditions.fuelType = Like(`%${fuelType}%`)
            }

            if (userId !== 0) {
                whereConditions.user = { userId: Not(userId) };
                cars = await this.carRepo.find({
                    relations: ['user', 'images', 'rents'],
                    where: whereConditions,
                    order: {
                        images: {
                            imageId: 'ASC'
                        }
                    },
                });
            } else {
                cars = await this.carRepo.find({
                    relations: ['images', 'rents'],
                    where: whereConditions,
                    order: {
                        images: {
                            imageId: 'ASC'
                        }
                    },
                });
            }

            if (!cars || cars.length === 0) {
                return cars;
            }

            cars = cars.filter(car => {
                const overlappingRents = car.rents.filter(rent =>
                    rent.rentStatus !== "finish" && rent.rentStatus !== "cancel" &&
                    (new Date(rent.rentBeginDate) < checkEndDate && new Date(rent.rentEndDate) > checkStartDate)
                );
                return overlappingRents.length === 0;
            });

            const carsWithStats = cars.map(async car => {
                if (car.images && car.images.length > 0) {
                    car.images = [car.images[0]];
                }
                delete car.user.password;

                const stats = await this.statisticCar(car.carId);
                return {
                    ...car,
                    stats: {
                        star: stats.star,
                        tripCount: stats.tripCount,
                        reviewCount: stats.reviewCount,
                    }
                };
            });

            return Promise.all(carsWithStats);
        } catch (e) {
            console.log(e);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllCar(): Promise<Car[]> {
        try {
            let cars = []
            cars = await this.carRepo.find({
                relations: ['images', 'user'], // Load các mối quan hệ để sử dụng trong điều kiện
                order: {
                    images: {
                        imageId: 'ASC'
                    }
                }
            });

            if (!cars || cars.length === 0) {
                return cars
            }
            cars = cars.map(async car => {
                if (car.images && car.images.length > 0) {
                    car.images = [car.images[0]];
                }

                let stats = await this.statisticCar(car.carId);
                return {
                    ...car,
                    stats: {
                        star: stats.star,
                        tripCount: stats.tripCount,
                        reviewCount: stats.reviewCount,
                    }
                };
            });
            return Promise.all(cars);

        }
        catch (e) {
            console.log(e);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async confirmCar(carId: number): Promise<Car> {
        let car = await this.carRepo.findOne({
            where: { carId: carId }
        })
        if (!car) {
            throw new HttpException("Car not found", HttpStatus.NOT_FOUND)
        }
        car.status = "Approved"
        return await this.carRepo.save(car)
    }
}
