import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './review.entity';
import { ReviewCarDTO } from './dto/reviewCarDTO.dto';
import { ReviewCarNotPasswordDTO } from './dto/ReviewCarNotPasswordDTO.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

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

    @Delete("/:reviewId")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("Staff", "Admin")
    deleteReviewById(@Param('reviewId') reviewId: number): Promise<Review> {
        try {
            return this.reviewService.deleteReviewById(reviewId)
        } catch (e) {
            throw new HttpException('Delete review failed', HttpStatus.NOT_FOUND)
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
