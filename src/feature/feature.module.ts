import { Module } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { FeatureController } from './feature.controller';
import { Feature } from './feature.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
;


@Module({
    imports: [TypeOrmModule.forFeature([Feature])],
    providers: [FeatureService],
    controllers: [FeatureController],
    exports: [FeatureService]
})
export class FeatureModule { }
