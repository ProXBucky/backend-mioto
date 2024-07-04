import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/CreateUserDTO.dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { UpdateUserDTO } from './dto/UpdateUserDTO.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ChangePasswordDTO } from './dto/ChangePasswordDTO.dto';
import * as argon2 from 'argon2';
import { GetUserDTO } from './dto/GetUserDTO.dto';
import { AddressService } from '../address/address.service';
import { LicenseService } from '../license/license.service';
import { VoucherService } from '../voucher/voucher.service';
import { RentService } from '../rent/rent.service';
import { CarService } from '../car/car.service';
import { ReportService } from '../report/report.service';
import { ReviewService } from '../review/review.service';
import { LikeService } from '../like/like.service';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { GetUserNotPasswordDTO } from './dto/GetUserNotPasswordDTO.dto';
@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly cloudinaryService: CloudinaryService,
        private readonly addressService: AddressService,
        private readonly licenseService: LicenseService,
        private readonly voucherOwnerService: VoucherService,
        private readonly rentService: RentService,
        private readonly carService: CarService,
        private readonly reportService: ReportService,
        private readonly reviewService: ReviewService,
        private readonly likeService: LikeService,

    ) { }

    async countUser() {
        return await this.userRepo.count()
    }

    async createNewUser(data: CreateUserDTO): Promise<User> {
        let checkUsername = await this.userRepo.findOne({ where: { username: data.username } })
        let checkEmail = await this.userRepo.findOne({ where: { email: data.email } })
        if (checkUsername) {
            throw new HttpException('Username is exist', HttpStatus.CONFLICT)
        }
        if (checkEmail) {
            throw new HttpException('Email is exist', HttpStatus.CONFLICT)
        }
        let newUser = new User
        newUser.username = data.username
        newUser.password = data.password
        newUser.fullname = data.fullname
        newUser.phone = data.phone
        newUser.email = data.email
        newUser.joinDate = new Date();
        let userr = await this.userRepo.save(newUser)
        return plainToClass(User, userr)
    }


    async findAllPaginated(options: IPaginationOptions): Promise<Pagination<GetUserNotPasswordDTO>> {
        const result = await paginate<User>(this.userRepo, options);
        const items = result.items.map(user => plainToClass(GetUserNotPasswordDTO, user));
        return { ...result, items };
    }

    async findAlls(): Promise<GetUserNotPasswordDTO[]> {
        const result = await this.userRepo.find()
        return result.map(user => plainToClass(GetUserNotPasswordDTO, user));
    }

    async findOneByUserId(userId: number): Promise<User> {
        let userFinded = await this.userRepo.findOne({ where: { userId: userId } })
        if (!userFinded) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }
        return plainToClass(User, userFinded)
    }

    async editUser(userId: number, data: UpdateUserDTO): Promise<User> {
        let userFinded = await this.userRepo.findOne({ where: { userId: userId } })
        if (!userFinded) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }
        if (data.fullname) {
            userFinded.fullname = data.fullname
        }
        if (data.email) {
            userFinded.email = data.email
        }
        if (data.phone) {
            userFinded.phone = data.phone
        }
        if (data.dob) {
            userFinded.dob = data.dob
        }
        if (data.gender) {
            userFinded.gender = data.gender
        }
        if (data.avatarImage) {
            if (userFinded.avatarImageID) {
                await this.cloudinaryService.deleteImage(userFinded.avatarImageID)
            }
            let res = await this.cloudinaryService.uploadImage(data.avatarImage)
            if (res && res.public_id && res.secure_url) {
                userFinded.avatarImage = res.secure_url
                userFinded.avatarImageID = res.public_id
            }
        }
        let updateUser = await this.userRepo.save(userFinded)
        return plainToClass(User, updateUser)
    }


    async changePassword(userId: number, data: ChangePasswordDTO): Promise<User> {
        const user = await this.userRepo.findOne({ where: { userId: userId } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        let passwordIsCorrect = await argon2.verify(user.password, data.password);
        if (!passwordIsCorrect) {
            throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST)
        }
        const hashedNewPassword = await argon2.hash(data.newPassword);
        user.password = hashedNewPassword
        return await this.userRepo.save(user)
    }

    async findOneByUsernameOrEmail(usernameOrEmail: string): Promise<GetUserDTO> {
        const userFinded = await this.userRepo.findOne({
            where: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        });
        if (!userFinded) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return plainToClass(GetUserDTO, userFinded);
    }

    async changePasswordByAdmin(userId: number, data: string): Promise<User> {
        const user = await this.userRepo.findOne({ where: { userId: userId } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const hashedNewPassword = await argon2.hash(data);
        user.password = hashedNewPassword
        return await this.userRepo.save(user)
    }

    async createNewUserByAdmin(data: User): Promise<User> {
        let checkUsername = await this.userRepo.findOne({ where: { username: data.username } })
        let checkEmail = await this.userRepo.findOne({ where: { email: data.email } })
        if (checkUsername) {
            throw new HttpException('Username is exist', HttpStatus.CONFLICT)
        }
        if (checkEmail) {
            throw new HttpException('Email is exist', HttpStatus.CONFLICT)
        }
        let newUser = new User
        newUser.username = data.username
        newUser.password = data.password
        newUser.fullname = data.fullname
        newUser.phone = data.phone
        newUser.email = data.email
        newUser.gender = data.gender
        newUser.dob = data.dob
        newUser.joinDate = new Date();
        if (data.avatarImage) {
            let res = await this.cloudinaryService.uploadImage(data.avatarImage)
            if (res && res.public_id && res.secure_url) {
                newUser.avatarImage = res.secure_url
                newUser.avatarImageID = res.public_id
            }
        }
        return await this.userRepo.save(newUser)

    }

    async deleteUser(userId: number): Promise<User> {
        const user = await this.userRepo.findOne({ where: { userId: userId } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        await this.cloudinaryService.deleteImage(user.avatarImageID)
        await this.addressService.deleteAddressByUserId(user.userId)
        await this.licenseService.deleteLicenseByUserId(user.userId)
        await this.reportService.deleteReportByUserId(user.userId)
        await this.reviewService.deleteReviewByUserId(user.userId)
        await this.likeService.deleteLikeByUserId(user.userId)
        await this.rentService.deleteRentByUserId(user.userId)
        await this.voucherOwnerService.deleteVoucherOwnByUserId(user.userId)
        await this.carService.deleteCarsByUserId(user.userId)
        return await this.userRepo.remove(user);
    }


}
