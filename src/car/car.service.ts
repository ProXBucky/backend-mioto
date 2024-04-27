import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './car.entity';
import { RegisterNewCarDTO } from './dto/RegisterNewCarDTO.dto';
import { OwnerService } from '../owner/owner.service';
import { FeatureService } from '../feature/feature.service';
import { CarHasFeatureService } from '../carHasFeature/carHasFeature.service';
import { ImageService } from '../carImage/image.service';

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

    async getCarByCarId(carId: number): Promise<Car> {
        return await this.carRepo.findOne({ where: { carId: carId } })
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
            newCar.district = body.district
            newCar.ward = body.ward
            newCar.streetAddress = body.streetAddress
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
}
