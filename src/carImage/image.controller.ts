import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { CarImage } from './image.entity';
import { Car } from 'src/car/car.entity';
import { ImageService } from './image.service';

@Controller('carImage')
export class ImageController {
    constructor(private readonly imageSerivce: ImageService) { }

    @Post("/:carId")
    postMultiImageCar(@Param('carId') carId: number, images: string[]): Promise<CarImage[]> {
        try {
            return this.imageSerivce.postMultiImageCar(carId, images)
        } catch (e) {
            console.log(e)
            throw new HttpException('Post images of car fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Get("/:carId")
    getAllCarImageByCarId(@Param('carId') carId: number): Promise<CarImage[]> {
        try {
            return this.imageSerivce.getAllCarImageByCarId(carId)
        } catch (e) {
            console.log(e)
            throw new HttpException('Post images of car fail', HttpStatus.BAD_REQUEST)
        }
    }

    @Delete("/:carId")
    deleteAllCarImageByCarId(@Param('carId') carId: number): Promise<CarImage[]> {
        try {
            return this.imageSerivce.deleteAllCarImageByCarId(carId)
        } catch (e) {
            console.log(e)
            throw new HttpException('Delete images of car fail', HttpStatus.BAD_REQUEST)
        }
    }
}
