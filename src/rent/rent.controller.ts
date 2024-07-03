import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
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

    @Delete("/:rentId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("Admin")
    deleteRent(@Param("rentId") rentId: number): Promise<Rent> {
        try {
            return this.rentService.deleteRent(rentId)
        } catch (e) {
            throw new HttpException('Delete rent car failed', HttpStatus.NOT_FOUND)
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
    @UseGuards(JwtAuthGuard)
    getAllTripByUserId(@Param('userId') userId: number): Promise<Rent[]> {
        try {
            return this.rentService.getAllTripByUserId(userId)
        } catch (e) {
            throw new HttpException('Get all trip failed', HttpStatus.NOT_FOUND)
        }
    }

    @Get("/all-order/:userId")
    @UseGuards(JwtAuthGuard)
    getAllOrderByUserId(@Param('userId') userId: number): Promise<Rent[]> {
        try {
            return this.rentService.getAllOrderByUserId(userId)
        } catch (e) {
            throw new HttpException('Get all trip failed', HttpStatus.NOT_FOUND)
        }
    }

    @Put("/cancel-trip/:rentId")
    @UseGuards(JwtAuthGuard)
    cancelRentByRentId(@Param('rentId') rentId: number): Promise<Rent> {
        return this.rentService.cancelRentByRentId(rentId)
    }

    @Put("/accept-trip/:rentId")
    @UseGuards(JwtAuthGuard)
    acceptRentByRentId(@Param('rentId') rentId: number): Promise<Rent> {
        try {
            return this.rentService.acceptRentByRentId(rentId)
        } catch (e) {
            throw new HttpException('Accept trip failed', HttpStatus.NOT_FOUND)
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("Admin", "Staff")
    async getAllTripPendingByCity(@Param('city') city: string): Promise<Rent[]> {
        try {
            return await this.rentService.getAllTripPendingByCity(city);
        } catch (e) {
            console.log(e)
            throw new HttpException('Get all trip fail', HttpStatus.NOT_FOUND);
        }
    }


    @Get("/all-trip-finish-by-city/:city")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("Admin", "Staff")
    async getAllTripFinishedByCity(@Param('city') city: string): Promise<Rent[]> {
        try {
            return await this.rentService.getAllTripFinishedByCity(city);
        } catch (e) {
            console.log(e)
            throw new HttpException('Get all trip fail', HttpStatus.NOT_FOUND);
        }
    }

    @Get("/count/:userId")
    async countRentOfUserId(@Param('userId') userId: number): Promise<number> {
        try {
            return await this.rentService.countRentOfUserId(userId);
        } catch (e) {
            console.log(e)
            throw new HttpException('Count rent fail', HttpStatus.NOT_FOUND);
        }
    }

    @Get("/income")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("Admin", "Staff")
    async statisticIncome(): Promise<{ labels: string[], data: number[] }> {
        try {
            return await this.rentService.statisticIncome();
        } catch (e) {
            console.log(e)
            throw new HttpException('Count rent fail', HttpStatus.NOT_FOUND);
        }
    }
}