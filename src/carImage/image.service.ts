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

    async getAllCarImageByCarId(carId: number): Promise<CarImage[]> {
        try {
            let res = await this.carImageRepo.find({ where: { car: { carId: carId } } })
            if (res && res.length > 0) {
                return res
            }
        } catch (err) {
            console.log(err)
        }
    }

    async deleteAllCarImageByCarId(carId: number): Promise<CarImage[]> {
        try {
            let res = await this.carImageRepo.find({ where: { car: { carId: carId } } })
            if (res && res.length > 0) {
                const imageLinkIDs = res.map(item => item.imageLinkID);
                await this.cloudinaryService.deleteMultiImages(imageLinkIDs)
                return await this.carImageRepo.remove(res)
            }
        } catch (err) {
            console.log(err)
        }
    }
}
