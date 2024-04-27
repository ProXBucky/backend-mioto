import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarHasFeature } from './carHasFeature.entity';
import { CarHasFeatureService } from './carHasFeature.service';


@Module({
    imports: [TypeOrmModule.forFeature([CarHasFeature])],
    providers: [CarHasFeatureService],
    controllers: [],
    exports: [CarHasFeatureService]
})
export class CarHasFeatureModule { }
