import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/CreateUserDTO.dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { UpdateUserDTO } from './dto/UpdateUserDTO.dto';
@Injectable()
export class UserService {

    constructor(@InjectRepository(User)
    private readonly userRepo: Repository<User>
    ) { }

    async createNewUser(data: CreateUserDTO): Promise<User> {
        let checkUsername = this.userRepo.findOne({ where: { username: data.username } })
        let checkEmail = this.userRepo.findOne({ where: { email: data.email } })
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


    async findAll(): Promise<User[]> {
        let users = await this.userRepo.find()
        return plainToClass(User, users)
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
        if (data.username) {
            userFinded.username = data.username
        }
        if (data.password) {
            userFinded.password = data.password
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
        if (data.avatarImage) {
            userFinded.avatarImage = data.avatarImage
        }
        let updateUser = await this.userRepo.save(userFinded)
        return plainToClass(User, updateUser)
    }

    async deleteUser(userId: number): Promise<User> {
        const user = await this.userRepo.findOne({ where: { userId } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        return await this.userRepo.remove(user);

    }

}
