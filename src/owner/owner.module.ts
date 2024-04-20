import { Module } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { OwnerController } from './owner.controller';
import { CarOwner } from './owner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([CarOwner])],
    providers: [OwnerService],
    controllers: [OwnerController]
})
export class OwnerModule { }
