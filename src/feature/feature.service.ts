import { Injectable } from '@nestjs/common';
import { Feature } from './feature.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { features } from 'process';

@Injectable()
export class FeatureService {
    constructor(
        @InjectRepository(Feature)
        private readonly featureRepo: Repository<Feature>
    ) { }

    async getAllFeature(): Promise<Feature[]> {
        return await this.featureRepo.find()
    }

    async convertArrFeatureCodetoArrFeatureId(arrFeatureCode: string[]): Promise<number[]> {
        try {
            const arrFeatureId: number[] = []
            const promises = arrFeatureCode.map(async featureCode => {
                let feature = await this.featureRepo.findOne({ where: { featureCode: featureCode } })
                arrFeatureId.push(feature.featureId)
            });
            await Promise.all(promises);
            return arrFeatureId;
        } catch (error) {
            throw error;
        }
    }

}
