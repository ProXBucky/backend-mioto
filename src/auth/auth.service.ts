import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as argon2 from "argon2"
import { GetUserDTO } from '../user/dto/GetUserDTO.dto';
import { plainToClass } from 'class-transformer';
import { GetAdminDTO } from '../admin/dto/GetAdminDTO.dto';
import { AdminService } from '../admin/admin.service';
import { Admin } from '../admin/admin.entity';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { EMAIL_USER, EMAIL_PASSWORD } from '../config';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly adminService: AdminService,
        private readonly mailerService: MailerService,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>

    ) { }

    async validateUser(username: string, password: string): Promise<GetUserDTO> {
        let user = await this.userService.findOneByUsernameOrEmail(username)
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        let checkPassword = await argon2.verify(user.password, password);
        if (!checkPassword) {
            throw new HttpException('Password is wrong', HttpStatus.CONFLICT)
        }
        return plainToClass(GetUserDTO, user)
    }

    async validateAdmin(username: string, password: string): Promise<Admin> {
        let admin = await this.adminService.findOneByUsernameOrEmail(username)
        if (!admin) {
            throw new HttpException('Admin not found', HttpStatus.NOT_FOUND)
        }
        let checkPassword = await argon2.verify(admin.password, password);
        if (!checkPassword) {
            throw new HttpException('Password is wrong', HttpStatus.CONFLICT)
        }
        return admin
    }

    async createToken(payload: any): Promise<string> {
        return this.jwtService.sign(payload);
    }

    async invalidateToken(token: string): Promise<void> {
        this.jwtService.decode(token);
    }


    async resetPassword(email: string): Promise<void> {
        const newPassword = crypto.randomBytes(8).toString('hex');
        let user = await this.userService.findOneByUsernameOrEmail(email)
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        await this.userService.changePasswordByAdmin(parseInt(user.userId), newPassword)
        await this.mailerService.sendMail({
            to: email,
            subject: 'Lấy lại mật khẩu',
            html: `<p>Mật khẩu mới của bạn là: ${newPassword}</p>
              <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
              <p>Vui lòng đổi lại mật khẩu mới sau khi lấy lại mật khẩu.</p>
              `,
            // { name: 'Recipient' },
        });
    }

    async findOrCreateUserFromGoogle(profile: any): Promise<User> {
        let user = await this.userRepo.findOne({ where: { email: profile.email } });
        if (user) {
            return user;
        }

        const newUser = new User();
        newUser.email = profile.email;
        newUser.fullname = `${profile.firstName} ${profile.lastName}`;
        newUser.googleId = profile.id;
        newUser.joinDate = new Date();

        const userr = await this.userRepo.save(newUser);
        return plainToClass(User, userr);
    }

    async findOrCreateUserFromFacebook(profile: any): Promise<User> {
        let user = await this.userRepo.findOne({ where: { email: profile.email } });
        if (user) {
            return user;
        }
        const newUser = new User();
        newUser.email = profile.email;
        newUser.fullname = `${profile.firstName} ${profile.lastName}`;
        newUser.facebookId = profile.id;
        newUser.joinDate = new Date();

        const userr = await this.userRepo.save(newUser);
        return plainToClass(User, userr);
    }
}
