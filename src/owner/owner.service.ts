import { Injectable } from '@nestjs/common';
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
}
