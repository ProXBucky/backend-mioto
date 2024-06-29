import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDTO } from './dto/CreateAdminDto.dto';
import { Admin } from './admin.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAdminDTO } from './dto/UpdateAdminDTO.dto';
import { plainToClass } from 'class-transformer';
import { GetAdminDTO } from './dto/GetAdminDTO.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as argon2 from 'argon2';
import { BlogService } from '../blog/blog.service';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class AdminService {

    constructor(
        @InjectRepository(Admin)
        private readonly adminRepo: Repository<Admin>,

        private readonly cloudinaryService: CloudinaryService,
        private readonly blogService: BlogService,
    ) { }

    async countAdmin() {
        return await this.adminRepo.count()
    }

    async createNewAdmin(data: Admin): Promise<Admin> {
        let checkUsername = await this.adminRepo.findOne({ where: { username: data.username } })
        let checkEmail = await this.adminRepo.findOne({ where: { email: data.email } })
        if (checkUsername) {
            throw new HttpException('Username is exist (admin)', HttpStatus.CONFLICT)
        }
        if (checkEmail) {
            throw new HttpException('Email is exist', HttpStatus.CONFLICT)
        }
        const hashedNewPassword = await argon2.hash(data.password);

        let newAdmin = new Admin
        newAdmin.username = data.username
        newAdmin.password = hashedNewPassword
        newAdmin.fullname = data.fullname
        newAdmin.phone = data.phone
        newAdmin.email = data.email
        newAdmin.role = data.role
        newAdmin.gender = data.gender
        newAdmin.dob = data.dob
        if (data.avatarImage) {
            let res = await this.cloudinaryService.uploadImage(data.avatarImage)
            if (res && res.public_id && res.secure_url) {
                newAdmin.avatarImage = res.secure_url
                newAdmin.avatarImageID = res.public_id
            }
        }
        return await this.adminRepo.save(newAdmin)

    }

    async findAll(options: IPaginationOptions): Promise<Pagination<GetAdminDTO>> {
        const result = await paginate<Admin>(this.adminRepo, options);
        const items = result.items.map(admin => plainToClass(GetAdminDTO, admin));
        return { ...result, items };
    }

    async findOneByAdminId(adminId: number): Promise<GetAdminDTO> {
        let adminFinded = await this.adminRepo.findOne({ where: { adminId: adminId } })
        if (!adminFinded) {
            throw new HttpException('Admin not found', HttpStatus.BAD_REQUEST)
        }
        return plainToClass(GetAdminDTO, adminFinded)
    }

    async editAdmin(adminId: number, data: UpdateAdminDTO): Promise<Admin> {
        let adminFind = await this.adminRepo.findOne({ where: { adminId: adminId } })
        if (!adminFind) {
            throw new HttpException('Admin not found', HttpStatus.BAD_REQUEST)
        }
        if (data.fullname) {
            adminFind.fullname = data.fullname
        }
        if (data.email) {
            adminFind.email = data.email
        }
        if (data.phone) {
            adminFind.phone = data.phone
        }
        if (data.dob) {
            adminFind.dob = data.dob
        }
        if (data.gender) {
            adminFind.gender = data.gender
        }
        if (data.role) {
            adminFind.role = data.role
        }
        if (data.avatarImage) {
            let res = await this.cloudinaryService.uploadImage(data.avatarImage)
            if (res && res.public_id && res.secure_url) {
                adminFind.avatarImage = res.secure_url
                adminFind.avatarImageID = res.public_id
            }
        }
        let updateAdmin = await this.adminRepo.save(adminFind)
        return plainToClass(Admin, updateAdmin)
    }

    async deleteAdmin(adminId: number): Promise<Admin> {
        try {
            let admin = await this.adminRepo.findOne({
                where: { adminId: adminId }
            })
            if (!admin) {
                throw new HttpException("admin not found", HttpStatus.NO_CONTENT)
            }
            await this.blogService.deleteBlogByAdminId(admin.adminId)
            return await this.adminRepo.remove(admin);
        } catch (err) {
            console.log(err)
        }
    }

    async findOneByUsernameOrEmail(usernameOrEmail: string): Promise<Admin> {
        const adminFinded = await this.adminRepo.findOne({
            where: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        });
        if (!adminFinded) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return plainToClass(Admin, adminFinded);
    }

    async changePasswordByAdmin(adminId: number, data: string): Promise<Admin> {
        const user = await this.adminRepo.findOne({ where: { adminId: adminId } });
        if (!user) {
            throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
        }
        const hashedNewPassword = await argon2.hash(data);
        user.password = hashedNewPassword
        return await this.adminRepo.save(user)
    }
}
