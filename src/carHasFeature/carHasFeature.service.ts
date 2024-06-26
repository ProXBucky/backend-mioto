import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CarHasFeature } from "./carHasFeature.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Car } from "../car/car.entity";
import { Feature } from "../feature/feature.entity";

@Injectable()
export class CarHasFeatureService {
    constructor(
        @InjectRepository(CarHasFeature)
        private readonly carHasFeatureRepo: Repository<CarHasFeature>

    ) { }

    async deleteCarHasFeatureByCarId(carId: number): Promise<CarHasFeature[]> {
        let res = await this.carHasFeatureRepo.find({
            where: { car: { carId: carId } }
        })
        return await this.carHasFeatureRepo.remove(res)
    }

    async createCarHaveFeature(carId: number, featureIds: number[]): Promise<CarHasFeature[]> {
        try {
            const car = new Car();
            car.carId = carId;

            const carHasFeatures: CarHasFeature[] = [];

            for (const featureId of featureIds) {
                const feature = new Feature();
                feature.featureId = featureId;

                const carHasFeature = new CarHasFeature();
                carHasFeature.car = car;
                carHasFeature.feature = feature;

                carHasFeatures.push(carHasFeature);
            }
            return await this.carHasFeatureRepo.save(carHasFeatures);
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

}
