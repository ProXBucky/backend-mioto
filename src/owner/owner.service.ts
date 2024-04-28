import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CarOwner } from './owner.entity';
import { User } from '../user/user.entity';
import { Car } from '../car/car.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OwnerService {
    constructor(
        @InjectRepository(CarOwner)
        private readonly carOwnerRepo: Repository<CarOwner>
    ) { }

    async createOwnNewCar(userId: number, carId: number): Promise<CarOwner> {
        let carOwner = new CarOwner

        let user = new User
        user.userId = userId

        let car = new Car
        car.carId = carId

        carOwner.user = user
        carOwner.car = car

        return await this.carOwnerRepo.save(carOwner)
    }

    async getAllOwnByUserId(userId: number): Promise<Car[]> {
        let cars = await this.carOwnerRepo.find({
            where: { user: { userId: userId } },
            relations: ['car', 'car.images'],
        });
        if (cars.length <= 0) {
            throw new HttpException('You havenot car', HttpStatus.NOT_FOUND);
        }
        return cars.map(carOwner => carOwner.car);
    }

    async deleteOwnByCarId(carId: number): Promise<CarOwner> {
        let res = await this.carOwnerRepo.findOne({ where: { car: { carId: carId } } })
        if (!res) {
            throw new HttpException('CarOwner not found', HttpStatus.NOT_FOUND)
        }
        return await this.carOwnerRepo.remove(res)
    }

}
