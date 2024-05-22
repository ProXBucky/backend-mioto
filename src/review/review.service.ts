import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { ReviewCarDTO } from './dto/reviewCarDTO.dto';
import { User } from '../user/user.entity';
import { Car } from '../car/car.entity';
import { ReviewCarNotPasswordDTO } from './dto/ReviewCarNotPasswordDTO.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private reviewRepo: Repository<Review>
    ) { }

    async postReviewCar(body: ReviewCarDTO): Promise<Review> {
        if (!body.carId || !body.userId || !body.content || !body.reviewScore || !body.location) {
            throw new HttpException('Missing parameter', HttpStatus.BAD_REQUEST)
        }
        let user = new User
        user.userId = body.userId

        let car = new Car
        car.carId = body.carId

        let newReview = new Review
        newReview.user = user
        newReview.car = car
        newReview.location = body.location
        newReview.content = body.content
        newReview.reviewScore = body.reviewScore
        newReview.reviewDate = new Date()

        return await this.reviewRepo.save(newReview)
    }


    async getAllReviewOfCar(carId: number): Promise<ReviewCarNotPasswordDTO[]> {
        let allReviews = await this.reviewRepo.find({
            where: { car: { carId: carId } },
            relations: ['user']
        })
        if (!allReviews || allReviews.length == 0) {
            throw new HttpException("No review", HttpStatus.NO_CONTENT)
        }
        return allReviews.map(review => {
            const reviewDto = plainToInstance(ReviewCarNotPasswordDTO, review);
            return reviewDto;
        });
    }


    async getAllReviewByCity(cityCode: string): Promise<ReviewCarNotPasswordDTO[]> {
        let allReviews = await this.reviewRepo.find({
            where: { location: cityCode },
            relations: ['user']
        })
        if (!allReviews || allReviews.length == 0) {
            throw new HttpException("No review", HttpStatus.NO_CONTENT)
        }
        return allReviews.map(review => {
            const reviewDto = plainToInstance(ReviewCarNotPasswordDTO, review);
            return reviewDto;
        });
    }

    async getReviewScore(carId: number): Promise<{ totalScoreReview: number, reviewCount: number }> {
        let allReviews = await this.reviewRepo.find({
            where: { car: { carId: carId } }
        })
        if (!allReviews || allReviews.length == 0) {
            throw new HttpException("No review", HttpStatus.NO_CONTENT)
        }
        let totalScore = 0
        allReviews.map(review => {
            totalScore += review.reviewScore
        });
        return {
            totalScoreReview: parseFloat((totalScore / allReviews.length).toFixed(1)),
            reviewCount: allReviews.length
        }

    }

}
