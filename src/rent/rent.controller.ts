import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Rent } from './rent.entity';
import { CreateNewRentDTO } from './dto/CreateNewRentDTO.dto';
import { RentService } from './rent.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

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

    @Get("/detail-trip/:rentId")
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

    @Put("/cancel-trip/:rentId")
    cancelRentByRentId(@Param('rentId') rentId: number): Promise<Rent> {
        try {
            return this.rentService.cancelRentByRentId(rentId)
        } catch (e) {
            throw new HttpException('Cancel trip failed', HttpStatus.NOT_FOUND)
        }
    }

    @Get("/check-status")
    checkStatusRent(@Query("carId") carId: number, @Query("beginDate") beginDate: string, @Query("endDate") endDate: string): Promise<boolean> {
        try {
            return this.rentService.checkStatusRent(carId, beginDate, endDate)
        } catch (e) {
            throw new HttpException('Cancel trip failed', HttpStatus.NOT_FOUND)
        }
    }

    @Get("/all-trip-pending-by-city/:city")
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles("Admin", "Staff")
    async getAllTripPendingByCity(@Param('city') city: string): Promise<Rent[]> {
        try {
            return await this.rentService.getAllTripPendingByCity(city);
        } catch (e) {
            console.log(e)
            throw new HttpException('Get all trip fail', HttpStatus.NOT_FOUND);
        }
    }
}