// app.controller.ts

import {
    Controller,
    Delete,
    Param,
    Post,
    Query,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
// ... other imports

@Controller('image')
export class CloudinaryController {
    constructor(readonly cloudinaryService: CloudinaryService) { }

    @Delete()
    async deleteImage(@Query('publicId') publicId: string): Promise<any> {
        return this.cloudinaryService.deleteImage(publicId);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        try {
            const result = await this.cloudinaryService.uploadImage(file.path)
            return result
        } catch (error) {
            console.error('Error uploading image', error)
            throw new Error('Failed to upload image')
        }
    }

    @Post('upload-license')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImageLicense(@UploadedFile() file: Express.Multer.File) {
        try {
            const result = await this.cloudinaryService.uploadImageLicense(file.path)
            return result
        } catch (error) {
            console.error('Error uploading image', error)
            throw new Error('Failed to upload image')
        }
    }


}
