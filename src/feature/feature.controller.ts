import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { Feature } from './feature.entity';
import { FeatureService } from './feature.service';

@Controller('feature')
export class FeatureController {
    constructor(private readonly featureService: FeatureService) { }

    @Get()
    getAllFeature(): Promise<Feature[]> {
        try {
            return this.featureService.getAllFeature()
        } catch (e) {
            console.log(e)
            throw new HttpException('Get feature fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Get('test')
    convertArrFeatureCodetoArrFeatureId(arr: string[]) {
        return this.featureService.convertArrFeatureCodetoArrFeatureId(arr)
    }

}
