import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './review.entity';
import { ReviewCarDTO } from './dto/reviewCarDTO.dto';
import { ReviewCarNotPasswordDTO } from './dto/ReviewCarNotPasswordDTO.dto';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Post()
    postReviewCar(@Body() body: ReviewCarDTO): Promise<Review> {
        try {
            return this.reviewService.postReviewCar(body)
        } catch (e) {
            throw new HttpException('Post review car failed', HttpStatus.NOT_FOUND)
        }
    }

    @Get("/:carId")
    getAllReviewOfCar(@Param('carId') carId: number): Promise<ReviewCarNotPasswordDTO[]> {
        try {
            return this.reviewService.getAllReviewOfCar(carId)
        } catch (e) {
            throw new HttpException('Get all review of car failed', HttpStatus.NOT_FOUND)
        }
    }

    @Get("/city/:cityCode")
    getAllReviewByCity(@Param('cityCode') cityCode: string): Promise<ReviewCarNotPasswordDTO[]> {
        try {
            return this.reviewService.getAllReviewByCity(cityCode)
        } catch (e) {
            throw new HttpException('Get all review car by city failed', HttpStatus.NOT_FOUND)
        }
    }

    @Get("/reviewScore/:carId")
    getReviewScore(@Param('carId') carId: number): Promise<{ totalScoreReview: number, reviewCount: number }> {
        try {
            return this.reviewService.getReviewScore(carId)
        } catch (e) {
            throw new HttpException('Get all review of car failed', HttpStatus.NOT_FOUND)
        }
    }
}
