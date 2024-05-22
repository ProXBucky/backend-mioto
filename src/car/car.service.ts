import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Car } from './car.entity';
import { RegisterNewCarDTO } from './dto/RegisterNewCarDTO.dto';
import { OwnerService } from '../owner/owner.service';
import { FeatureService } from '../feature/feature.service';
import { CarHasFeatureService } from '../carHasFeature/carHasFeature.service';
import { ImageService } from '../carImage/image.service';
import { EditCarDTO } from './dto/EditCarDTO.dto';
import { GetCarDTO } from './dto/GetCarDTO.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CarService {
    constructor(
        @InjectRepository(Car)
        private readonly carRepo: Repository<Car>,
        private readonly ownerService: OwnerService,
        private readonly featureService: FeatureService,
        private readonly carHasFeatureService: CarHasFeatureService,
        private readonly carImageService: ImageService
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

    async getAllCarByCity(city: string): Promise<Car[]> {
        let cars = await this.carRepo.find({
            where: { location: Like(`%${city}%`) },
            relations: ['images'],
        });
        if (!cars) {
            throw new HttpException('List car not found', HttpStatus.NOT_FOUND);
        }
        cars = cars.map(car => {
            if (car.images && car.images.length > 0) {
                car.images = [car.images[0]];
            }
            return car;
        })
        return cars
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
            newCar.status = "Đang duyệt"
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
}
