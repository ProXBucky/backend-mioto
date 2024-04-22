import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLicenseDTO } from './dto/CreateLicenseDTO.dto';
import { UserLicense } from './license.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { User } from '../user/user.entity';

@Injectable()
export class LicenseService {
    constructor(
        @InjectRepository(UserLicense)
        private readonly userLicenseRepo: Repository<UserLicense>,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async getLicenseByUserId(userId: number): Promise<UserLicense> {
        let licenseFind = await this.userLicenseRepo.findOne({ where: { user: { userId: userId } } })
        if (!licenseFind) {
            throw new HttpException('License not found', HttpStatus.NOT_FOUND)
        }
        return licenseFind
    }


    async postLicense(userId: number, data: CreateLicenseDTO): Promise<UserLicense> {
        let licenseFind = await this.userLicenseRepo.findOne({ where: { user: { userId } } })
        if (!licenseFind) {
            let userLicense = new UserLicense
            userLicense.licenseNumber = data.licenseNumber

            let user = new User();
            user.userId = userId;
            userLicense.user = user;

            let res = await this.cloudinaryService.uploadImage(data.fileUpload)
            if (res && res.public_id && res.secure_url) {
                userLicense.fileUpload = res.secure_url
                userLicense.fileUploadID = res.public_id
            }
            let license = await this.userLicenseRepo.save(userLicense)
            return license
        }
        // When have license in db
        else {
            if (data.licenseNumber) {
                licenseFind.licenseNumber = data.licenseNumber
            }
            if (data.fileUpload) {
                let res = await this.cloudinaryService.deleteImage(licenseFind.fileUploadID)
                if (res) {
                    let response = await this.cloudinaryService.uploadImageLicense(data.fileUpload)
                    if (response && response.public_id && response.secure_url) {
                        licenseFind.fileUpload = response.secure_url
                        licenseFind.fileUploadID = response.public_id
                    }
                }
            }
            let license = await this.userLicenseRepo.save(licenseFind)
            return license
        }

    }
}
