import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDTO } from './dto/CreateAdminDto.dto';
import { Admin } from './admin.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAdminDTO } from './dto/UpdateAdminDTO.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AdminService {

    constructor(@InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>
    ) { }

    async createNewAdmin(data: CreateAdminDTO): Promise<Admin> {
        let checkUsername = await this.adminRepo.findOne({ where: { username: data.username } })
        let checkEmail = await this.adminRepo.findOne({ where: { email: data.email } })
        if (checkUsername) {
            throw new HttpException('Username is exist (admin)', HttpStatus.CONFLICT)
        }
        if (checkEmail) {
            throw new HttpException('Email is exist', HttpStatus.CONFLICT)
        }
        let newAdmin = new Admin
        newAdmin.username = data.username
        newAdmin.password = data.password
        newAdmin.fullname = data.fullname
        newAdmin.phone = data.phone
        newAdmin.email = data.email
        let adminn = await this.adminRepo.save(newAdmin)
        return plainToClass(Admin, adminn)
    }


    async findAll(): Promise<Admin[]> {
        let admins = await this.adminRepo.find()
        return plainToClass(Admin, admins)
    }

    async findOneByAdminId(adminId: number): Promise<Admin> {
        let adminFinded = await this.adminRepo.findOne({ where: { adminId: adminId } })
        if (!adminFinded) {
            throw new HttpException('Admin not found', HttpStatus.BAD_REQUEST)
        }
        return plainToClass(Admin, adminFinded)
    }

    async editAdmin(adminId: number, data: UpdateAdminDTO): Promise<Admin> {
        let adminFind = await this.adminRepo.findOne({ where: { adminId: adminId } })
        if (!adminFind) {
            throw new HttpException('Admin not found', HttpStatus.BAD_REQUEST)
        }
        if (data.username) {
            adminFind.username = data.username
        }
        if (data.password) {
            adminFind.password = data.password
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
        let updateAdmin = await this.adminRepo.save(adminFind)
        return plainToClass(Admin, updateAdmin)
    }

    async deleteAdmin(adminId: number): Promise<Admin> {
        const user = await this.adminRepo.findOne({ where: { adminId } });
        if (!user) {
            throw new HttpException('Admin not found', HttpStatus.BAD_REQUEST);
        }
        return await this.adminRepo.remove(user);

    }
}
