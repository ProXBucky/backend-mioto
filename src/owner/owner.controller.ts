import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { CarOwner } from './owner.entity';
import { OwnerService } from './owner.service';
import { Car } from 'src/car/car.entity';

@Controller('owner')
export class OwnerController {
    constructor(private readonly carOwnerService: OwnerService) { }


    @Get('/:userId')
    getAllOwnByUserId(@Param('userId') userId: number): Promise<Car[]> {
        try {
            return this.carOwnerService.getAllOwnByUserId(userId)
        } catch (e) {
            throw new HttpException('Get car fail', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
