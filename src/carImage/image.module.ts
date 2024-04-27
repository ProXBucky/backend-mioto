import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { CarImage } from './image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';



@Module({
    imports: [TypeOrmModule.forFeature([CarImage])],
    providers: [ImageService, CloudinaryService],
    controllers: [ImageController],
    exports: [ImageService]
})
export class ImageModule { }
