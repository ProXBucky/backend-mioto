import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { Car } from './car.entity';
import { RegisterNewCarDTO } from './dto/RegisterNewCarDTO.dto';
import { OwnerService } from '../owner/owner.service';
import { FeatureService } from '../feature/feature.service';
import { CarHasFeatureService } from '../carHasFeature/carHasFeature.service';
import { ImageService } from '../carImage/image.service';
import { EditCarDTO } from './dto/EditCarDTO.dto';
import { GetCarDTO } from './dto/GetCarDTO.dto';
import { plainToInstance } from 'class-transformer';
import { ReviewService } from '../review/review.service';
import { RentService } from '../rent/rent.service';

@Injectable()
export class CarService {
    constructor(
        @InjectRepository(Car)
        private readonly carRepo: Repository<Car>,
        private readonly ownerService: OwnerService,
        private readonly featureService: FeatureService,
        private readonly carHasFeatureService: CarHasFeatureService,
        private readonly carImageService: ImageService,
        private readonly reviewService: ReviewService,
        private readonly rentService: RentService
    ) { }

    async getCarByCarId(carId: number): Promise<GetCarDTO> {
        let cars = await this.carRepo.findOne({
            where: { carId: carId },
            relations: ['images', 'carFeatures.feature', 'owners.user'],
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

    async getAllCarByCity(city: string, userId: number): Promise<Car[]> {
        try {
            let cars = []
            if (userId !== 0) {
                cars = await this.carRepo.find({
                    relations: ['owners', 'owners.user', 'images'], // Load các mối quan hệ để sử dụng trong điều kiện
                    where: {
                        location: Like(`%${city}%`),
                        status: Not("Approving"),
                        owners: {
                            user: {
                                userId: Not(userId)
                            }
                        }
                    }
                });
            }
            else {
                cars = await this.carRepo.find({
                    relations: ['images'], // Load các mối quan hệ để sử dụng trong điều kiện
                    where: {
                        location: Like(`%${city}%`),
                        status: Not("Approving"),
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
            let carReponse = await this.carRepo.save(newCar)
            if (carReponse && carReponse.carId) {
                try {
                    let res = await this.ownerService.createOwnNewCar(userId, carReponse.carId)
                    if (!res) {
                        throw new HttpException('Create Own Car Fail', HttpStatus.BAD_REQUEST)
                    }
                } catch (err) {
                    console.log('1', err)
                }
            }

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

    // async deleteCarByCarId(carId: number): Promise<Car> {

    // }

    convertToDate(dateString: string): Date {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date
    }


    async findAllCar(city: string, userId: number, beginDate: string, endDate: string): Promise<Car[]> {
        try {
            let cars: Car[] = [];

            // Chuyển đổi chuỗi ngày thành đối tượng Date
            const checkStartDate = this.convertToDate(beginDate);
            const checkEndDate = this.convertToDate(endDate);

            // Kiểm tra điều kiện userId và lấy danh sách xe tương ứng
            if (userId !== 0) {
                cars = await this.carRepo.find({
                    relations: ['owners', 'owners.user', 'images', 'rents'], // Load các mối quan hệ để sử dụng trong điều kiện
                    where: {
                        location: Like(`%${city}%`),
                        status: Not("Approving"),
                        owners: {
                            user: {
                                userId: Not(userId)
                            }
                        }
                    }
                });
            } else {
                cars = await this.carRepo.find({
                    relations: ['images', 'rents'], // Load các mối quan hệ để sử dụng trong điều kiện
                    where: {
                        location: Like(`%${city}%`),
                        status: Not("Approving"),
                    }
                });
            }

            if (!cars || cars.length === 0) {
                return cars;
            }

            // Lọc các xe đã bị thuê trong khoảng thời gian yêu cầu
            cars = cars.filter(car => {
                const overlappingRents = car.rents.filter(rent =>
                    rent.rentStatus !== "completed" && rent.rentStatus !== "cancel" && // Lọc các trạng thái không ảnh hưởng
                    (new Date(rent.rentBeginDate) < checkEndDate && new Date(rent.rentEndDate) > checkStartDate) // Kiểm tra trùng lặp thời gian
                );
                return overlappingRents.length === 0;
            });

            // Chỉnh sửa danh sách ảnh và thêm thống kê cho mỗi xe
            const carsWithStats = cars.map(async car => {
                if (car.images && car.images.length > 0) {
                    car.images = [car.images[0]]; // Chỉ lấy ảnh đầu tiên
                }

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




}
