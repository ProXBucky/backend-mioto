import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { Rent } from './rent.entity';
import { CreateNewRentDTO } from './dto/CreateNewRentDTO.dto';
import { RentService } from './rent.service';

@Controller('rent')
export class RentController {
    constructor(private readonly rentService: RentService) { }

    @Post()
    createNewRent(@Body() body: CreateNewRentDTO): Promise<Rent> {
        try {
            return this.rentService.createNewRent(body)
        } catch (e) {
            throw new HttpException('Rent car failed', HttpStatus.NOT_FOUND)
        }
    }

    @Get("/:rentId")
    getTripByRentId(@Param('rentId') rentId: number): Promise<Rent> {
        try {
            return this.rentService.getTripByRentId(rentId)
        } catch (e) {
            throw new HttpException('Get trip information failed', HttpStatus.NOT_FOUND)
        }
    }

    @Get("/all-trip/:userId")
    getAllTripByUserId(@Param('userId') userId: number): Promise<Rent[]> {
        try {
            return this.rentService.getAllTripByUserId(userId)
        } catch (e) {
            throw new HttpException('Get all trip failed', HttpStatus.NOT_FOUND)
        }
    }
}