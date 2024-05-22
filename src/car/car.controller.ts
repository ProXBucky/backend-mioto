import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CarService } from './car.service';
import { Car } from './car.entity';
import { RegisterNewCarDTO } from './dto/RegisterNewCarDTO.dto';
import { EditCarDTO } from './dto/EditCarDTO.dto';
import { GetCarDTO } from './dto/GetCarDTO.dto';

@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService) { }

    @Get("/:carId")
    getCarByCarId(@Param('carId') carId: number): Promise<GetCarDTO> {
        try {
            return this.carService.getCarByCarId(carId)
        } catch (e) {
            throw new HttpException('Get car fail', HttpStatus.NOT_FOUND)
        }
    }

    @Get("/all/:city")
    getAllCarByCity(@Param('city') city: string): Promise<Car[]> {
        try {
            return this.carService.getAllCarByCity(city)
        } catch (e) {
            throw new HttpException('Get all car fail', HttpStatus.NOT_FOUND)
        }
    }

    @Post("/register/:userId")
    registerNewCar(@Param('userId') userId: number, @Body() body: RegisterNewCarDTO): Promise<Car> {
        try {
            console.log('-1')
            return this.carService.registerNewCar(userId, body)
        } catch (e) {
            console.log('0', e)
            throw new HttpException('Register car fail', HttpStatus.NOT_FOUND)
        }
    }

    @Put("/edit/:carId")
    editInformationCar(@Param('carId') carId: number, @Body() body: EditCarDTO): Promise<Car> {
        try {
            return this.carService.editInformationCar(carId, body)
        } catch (e) {
            console.log('0', e)
            throw new HttpException('Edit car fail', HttpStatus.NOT_FOUND)
        }
    }

    // @Delete("/:carId")
    // deleteCarByCarId(@Param('carId') carId: number): Promise<Car> {
    //     try {
    //         return this.carService.deleteCarByCarId(carId)
    //     } catch (e) {
    //         throw new HttpException('Delete car fail', HttpStatus.NOT_FOUND)
    //     }
    // }

}
