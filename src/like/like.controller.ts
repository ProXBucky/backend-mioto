import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { LikeService } from './like.service';
import { Like } from './like.entity';
import { LikeDTO } from './dto/LikeDTO.dto';
import { GetLikeDTO } from './dto/GetLikeDTO.dto';

@Controller('like')
export class LikeController {
    constructor(private readonly likeService: LikeService) { }

    @Post()
    likeCarAction(@Body() body: LikeDTO): Promise<Like> {
        try {
            return this.likeService.likeCarAction(body)
        } catch (e) {
            throw new HttpException('Like car failed', HttpStatus.NOT_FOUND)
        }
    }

    @Delete()
    dislikeCarAction(@Query('userId') userId: number, @Query('carId') carId: number): Promise<Like> {
        try {
            return this.likeService.dislikeCarAction(userId, carId)
        } catch (e) {
            throw new HttpException('Dislike car failed', HttpStatus.NOT_FOUND)
        }
    }

    @Get("/checkLike")
    checkLike(@Query('userId') userId: number, @Query('carId') carId: number): Promise<Like> {
        try {
            return this.likeService.checkLike(userId, carId)
        } catch (e) {
            throw new HttpException('Check car failed', HttpStatus.NOT_FOUND)
        }
    }


    @Get("/:userId")
    getAllCarLiked(@Param('userId') userId: number): Promise<GetLikeDTO[]> {
        try {
            return this.likeService.getAllCarLiked(userId)
        } catch (e) {
            throw new HttpException('Dislike car failed', HttpStatus.NOT_FOUND)
        }
    }



}
