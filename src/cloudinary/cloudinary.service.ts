// cloudinary.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary, v2 } from 'cloudinary';
import { CLOUD_API_KEY, CLOUD_API_SECRET, CLOUD_NAME } from '../config';

@Injectable()
export class CloudinaryService {
    constructor() {
        v2.config({
            cloud_name: CLOUD_NAME,
            api_key: CLOUD_API_KEY,
            api_secret: CLOUD_API_SECRET
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

    async uploadMultiImages(images: string[]): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
        const uploadPromises: Promise<(UploadApiResponse | UploadApiErrorResponse)>[] = images.map(image => {
            return new Promise((resolve, reject) => {
                v2.uploader.upload(image, { folder: 'carImage' }, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });
        });

        try {
            return await Promise.all(uploadPromises);
        } catch (error) {
            throw error;
        }
    }

    async deleteMultiImages(publicIdArray: string[]): Promise<any> {
        try {
            const deletionResults = await Promise.all(publicIdArray.map(publicId => {
                return v2.uploader.destroy(publicId);
            }));
            return deletionResults.map(result => {
                if (result.result === 'ok') {
                    return { success: true };
                } else {
                    return { success: false, error: result.error };
                }
            });
        } catch (error) {
            console.error('Error deleting images:', error);
            if (error.http_code === 404) {
                throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async uploadImageLicense(filePath: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
            v2.uploader.upload(filePath, { folder: 'license' }, (error, result) => {
                if (error) return reject(error);
                resolve(result)
            })
        });
    }

    async uploadImageTitleBlog(filePath: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
            v2.uploader.upload(filePath, { folder: 'blog' }, (error, result) => {
                if (error) return reject(error);
                resolve(result)
            })
        });
    }





}


