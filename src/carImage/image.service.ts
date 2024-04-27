import { Injectable } from '@nestjs/common';
import { CarImage } from './image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../car/car.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(CarImage) private readonly carImageRepo: Repository<CarImage>,
        private readonly cloudinaryService: CloudinaryService

    ) { }

    async postMultiImageCar(carIds: number, images: string[]): Promise<CarImage[]> {
        try {
            const uploadedImages: (UploadApiResponse | UploadApiErrorResponse)[] = await this.cloudinaryService.uploadMultiImages(images);
            const carImages: CarImage[] = uploadedImages.map(uploadedImage => {
                const car = new Car();
                car.carId = carIds
                let carImage = new CarImage()
                carImage.car = car
                carImage.imageLink = uploadedImage.secure_url
                carImage.imageLinkID = uploadedImage.public_id
                return carImage;
            });
            return await this.carImageRepo.save(carImages);
        } catch (error) {
            // Xử lý lỗi ở đây
            throw error;
        }
    }
}
