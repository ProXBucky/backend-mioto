// cloudinary.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary, v2 } from 'cloudinary';


@Injectable()
export class CloudinaryService {
    constructor() {
        v2.config({
            cloud_name: 'dqi9ub7dw',
            api_key: '135871654966123',
            api_secret: 'GDXm_IEKZyaz7LJ8PQiRlecvwBQ'
        })
    }

    async deleteImage(publicId: string): Promise<any> {
        try {
            const result = await v2.uploader.destroy(publicId);
            return result;
        } catch (error) {
            console.error('Error deleting image:', error);
            if (error.http_code === 404) {
                throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async uploadImage(filePath: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
            v2.uploader.upload(filePath, { folder: 'avatar' }, (error, result) => {
                if (error) return reject(error);
                resolve(result)
            })
        });
    }

    async uploadImageLicense(filePath: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
            v2.uploader.upload(filePath, { folder: 'license' }, (error, result) => {
                if (error) return reject(error);
                resolve(result)
            })
        });
    }
}
