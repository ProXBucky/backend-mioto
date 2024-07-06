import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Car } from '../car/car.entity';
import { ReviewCarNotPasswordDTO } from './dto/ReviewCarNotPasswordDTO.dto';
import { plainToInstance } from 'class-transformer';
import { ReviewCarDTO } from './dto/ReviewCarDTO.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private reviewRepo: Repository<Review>
    ) { }

    async countReview() {
        return await this.reviewRepo.count()
    }

    async deleteReviewByCarId(carId: number): Promise<Review[]> {
        let reviews = await this.reviewRepo.find({
            where: { car: { carId: carId } }
        })
        return await this.reviewRepo.remove(reviews)
    }

    async deleteReviewByUserId(userId: number): Promise<Review[]> {
        let reports = await this.reviewRepo.find({
            where: { user: { userId: userId } }
        })
        return await this.reviewRepo.remove(reports)
    }

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

    async deleteReviewById(reviewId: number): Promise<Review> {
        let review = await this.reviewRepo.findOne({
            where: { reviewId: reviewId }
        })
        if (!review) {
            throw new HttpException("No review in DB", HttpStatus.NO_CONTENT)
        }
        return await this.reviewRepo.remove(review)
    }


    async getAllReviewByCity(cityCode: string): Promise<ReviewCarNotPasswordDTO[]> {
        let allReviews = []
        if (cityCode === "tatCa") {
            allReviews = await this.reviewRepo.find({
                order: {
                    reviewDate: 'DESC'
                },
                relations: ['user']
            })
            if (!allReviews || allReviews.length == 0) {
                throw new HttpException("No review", HttpStatus.NO_CONTENT)
            }
        } else {
            allReviews = await this.reviewRepo.find({
                where: { location: cityCode },
                order: {
                    reviewDate: 'DESC'
                },
                relations: ['user']
            })
            if (!allReviews || allReviews.length == 0) {
                throw new HttpException("No review", HttpStatus.NO_CONTENT)
            }
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
        if (!allReviews) {
            throw new HttpException('Car is not extist', HttpStatus.NOT_FOUND)
        }
        if (allReviews.length == 0) {
            return {
                totalScoreReview: 0,
                reviewCount: 0
            }
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
