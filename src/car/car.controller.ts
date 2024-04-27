import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { CarService } from './car.service';
import { Car } from './car.entity';
import { RegisterNewCarDTO } from './dto/RegisterNewCarDTO.dto';

@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService) { }

    @Get("/:carId")
    getCarByCarId(@Param('carId') carId: number): Promise<Car> {
        return this.carService.getCarByCarId(carId)
    }

    @Post("/register/:userId")
    registerNewCar(@Param('userId') userId: number, @Body() body: RegisterNewCarDTO): Promise<Car> {
        try {
            console.log('-1')
            return this.carService.registerNewCar(userId, body)
        } catch (e) {
            console.log('0', e)
            throw new HttpException('Register car fail', HttpStatus.CONFLICT)
        }
    }

}
