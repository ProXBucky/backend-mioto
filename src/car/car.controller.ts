import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CarService } from './car.service';
import { Car } from './car.entity';
import { RegisterNewCarDTO } from './dto/RegisterNewCarDTO.dto';
import { EditCarDTO } from './dto/EditCarDTO.dto';
import { GetCarDTO } from './dto/GetCarDTO.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService) { }

    @Get("owner/:userId")
    getCarByUserId(@Param('userId') userId: number): Promise<GetCarDTO[]> {
        try {
            return this.carService.getCarByUserId(userId)
        } catch (e) {
            throw new HttpException('Get car fail', HttpStatus.NOT_FOUND)
        }
    }

    @Get("car-detail/:carId")
    getCarByCarId(@Param('carId') carId: number): Promise<GetCarDTO> {
        try {
            return this.carService.getCarByCarId(carId)
        } catch (e) {
            throw new HttpException('Get car fail', HttpStatus.NOT_FOUND)
        }
    }


    @Get("/all-car-by-city")
    async getAllCarByCity(@Query('city') city: string, @Query('userId') userId: number, @Query('limit') limit: number): Promise<Car[]> {
        if (isNaN(userId)) {
            throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.carService.getAllCarByCity(city, userId, +limit);
        } catch (e) {
            throw new HttpException('Get all car fail', HttpStatus.NOT_FOUND);
        }
    }

    @Get("/all-car-by-city-by-admin/:city")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("Admin", "Staff")
    async getAllCarByCityByAdmin(@Param('city') city: string): Promise<Car[]> {
        try {
            return await this.carService.getAllCarByCityByAdmin(city);
        } catch (e) {
            throw new HttpException('Get all car fail', HttpStatus.NOT_FOUND);
        }
    }



    @Post("/register/:userId")
    @UseGuards(JwtAuthGuard)
    registerNewCar(@Param('userId') userId: number, @Body() body: RegisterNewCarDTO): Promise<Car> {
        try {
            return this.carService.registerNewCar(userId, body)
        } catch (e) {
            throw new HttpException('Register car fail', HttpStatus.NOT_FOUND)
        }
    }

    @Post("/register-by-admin/:userId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Staff', 'Admin')
    registerNewCarByAdmin(@Param('userId') userId: number, @Body() body: RegisterNewCarDTO): Promise<Car> {
        try {
            return this.carService.registerNewCarByAdmin(userId, body)
        } catch (e) {
            throw new HttpException('Register car fail', HttpStatus.NOT_FOUND)
        }
    }

    @Put("/edit/:carId")
    @UseGuards(JwtAuthGuard)
    editInformationCar(@Param('carId') carId: number, @Body() body: EditCarDTO): Promise<Car> {
        try {
            return this.carService.editInformationCar(carId, body)
        } catch (e) {
            console.log('0', e)
            throw new HttpException('Edit car fail', HttpStatus.NOT_FOUND)
        }
    }

    @Put("/edit-by-admin/:carId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Staff', 'Admin')
    editInformationCarByAdmin(@Param('carId') carId: number, @Body() body: EditCarDTO): Promise<Car> {
        try {
            return this.carService.editInformationCarByAdmin(carId, body)
        } catch (e) {
            console.log('0', e)
            throw new HttpException('Edit car fail', HttpStatus.NOT_FOUND)
        }
    }


    @Delete("/delete/:carId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    deleteCarByCarId(@Param('carId') carId: number): Promise<Car> {
        try {
            return this.carService.deleteCarByCarId(carId)
        } catch (e) {
            throw new HttpException('Delete car fail', HttpStatus.NOT_FOUND)
        }
    }

    @Get("/statistic/:carId")
    async statisticCar(@Param('carId') carId: number): Promise<{ star: number, tripCount: number, reviewCount: number }> {
        try {
            return this.carService.statisticCar(carId)
        } catch (e) {
            throw new HttpException('Statistic car fail', HttpStatus.NOT_FOUND)
        }
    }

    @Get("/find")
    async findAllCar(@Query() query: any): Promise<Car[]> {
        try {
            return await this.carService.findAllCar(query);
        } catch (e) {
            throw new HttpException('Get all car fail', HttpStatus.NOT_FOUND);
        }
    }

    @Get("/all-car")
    async getAllCar(): Promise<Car[]> {
        try {
            return await this.carService.getAllCar();
        } catch (e) {
            throw new HttpException('Get all car fail', HttpStatus.NOT_FOUND);
        }
    }

    @Put("/confirm-car/:carId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Staff', 'Admin')
    async confirmCar(@Param("carId") carId: number): Promise<Car> {
        try {
            return await this.carService.confirmCar(carId);
        } catch (e) {
            throw new HttpException('Get all car fail', HttpStatus.NOT_FOUND);
        }
    }

}
