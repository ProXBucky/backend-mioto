import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Car } from '../car/car.entity';
import { LikeDTO } from './dto/LikeDTO.dto';
import { plainToInstance } from 'class-transformer';
import { GetLikeDTO } from './dto/GetLikeDTO.dto';

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(Like) private readonly likeRepo: Repository<Like>
    ) { }

    async deleteLikeByCarId(carId: number): Promise<Like[]> {
        let likes = await this.likeRepo.find({
            where: { car: { carId: carId } }
        })
        return await this.likeRepo.remove(likes)
    }

    async deleteLikeByUserId(userId: number): Promise<Like[]> {
        let likes = await this.likeRepo.find({
            where: { user: { userId: userId } }
        })
        return await this.likeRepo.remove(likes)
    }

    async likeCarAction(body: LikeDTO): Promise<Like> {
        if (!body.userId || !body.carId) {
            throw new HttpException('Error missing parameter ', HttpStatus.BAD_REQUEST)
        }

        let carLiked = await this.likeRepo.findOne({
            where: {
                user: { userId: body.userId },
                car: { carId: body.carId }
            }
        });

        if (carLiked) {
            throw new HttpException('You have liked this car yet', HttpStatus.BAD_REQUEST)
        }

        let user = new User
        user.userId = body.userId

        let car = new Car
        car.carId = body.carId

        let like = new Like
        like.car = car
        like.user = user

        return await this.likeRepo.save(like)
    }


    async dislikeCarAction(userId: number, carId: number): Promise<Like> {
        if (!userId || !carId) {
            throw new HttpException('Error missing parameter ', HttpStatus.BAD_REQUEST)
        }

        let carLiked = await this.likeRepo.findOne({
            where: {
                user: { userId: userId },
                car: { carId: carId }
            }
        });

        if (!carLiked) {
            throw new HttpException('You dont like this car', HttpStatus.BAD_GATEWAY)
        }
        return await this.likeRepo.remove(carLiked)
    }

    async checkLike(userId: number, carId: number): Promise<Like> {
        let carLiked = await this.likeRepo.findOne({
            where: {
                user: { userId: userId },
                car: { carId: carId }
            }
        });

        if (!carLiked) {
            throw new HttpException('You dont like it', HttpStatus.NO_CONTENT);
        }

        return carLiked;
    }

    async getAllCarLiked(userId: number): Promise<GetLikeDTO[]> {
        let allCarliked = await this.likeRepo.find({
            where: { user: { userId: userId } },
            relations: ['car', 'car.images', 'car.user'],
            order: {
                car: {
                    images: {
                        imageId: "DESC"
                    }
                }
            }
        })
        if (!allCarliked) {
            throw new HttpException('Error system', HttpStatus.BAD_REQUEST)

        }
        if (allCarliked.length == 0) {
            throw new HttpException('You dont like any car yet', HttpStatus.NO_CONTENT)
        }
        return allCarliked.map(car => {
            const carLikeDto = plainToInstance(GetLikeDTO, car);
            return carLikeDto;
        });
    }

}
