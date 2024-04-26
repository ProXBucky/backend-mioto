import { Injectable } from '@nestjs/common';
import { Feature } from './feature.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FeatureService {
    constructor(
        @InjectRepository(Feature)
        private readonly featureRepo: Repository<Feature>
    ) { }

    async getAllFeature(): Promise<Feature[]> {
        return await this.featureRepo.find()
    }
}
