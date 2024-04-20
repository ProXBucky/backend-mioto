import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { CarImage } from './image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
    imports: [TypeOrmModule.forFeature([CarImage])],
    providers: [ImageService],
    controllers: [ImageController]
})
export class ImageModule { }
